// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================
import BaseDataStore from "../DataStore/BaseDataStore";
import UserStore from "../UserStore";
import RootStore from "../RootStore";
import { METADATA_NAMESPACE } from "../../constants";
import { callMetricsApi } from "../../api/metrics/metricsClient";

let rootStore;
let baseStore;

jest.mock("../UserStore");
jest.mock("../DataStore/MatrixStore");
jest.mock("../DataStore/CaseTableStore");
jest.mock("../DataStore/RevocationsChartStore");
jest.mock("../DataStore/RevocationsOverTimeStore");
jest.mock("../../api/metrics/metricsClient", () => {
  return {
    callMetricsApi: jest.fn().mockResolvedValue({
      revocations_matrix_distribution_by_district: {
        flattenedValueMatrix: "0,0",
        metadata: {
          total_data_points: 1,
          dimension_manifest: [["reported_violations", ["0"]]],
          value_keys: ["population_count"],
        },
      },
    }),
  };
});

const tenantId = "US_MO";
const metadataField = `${METADATA_NAMESPACE}app_metadata`;
const mockUser = { [metadataField]: { state_code: tenantId } };

describe("BaseDataStore", () => {
  const mockGetTokenSilently = jest.fn();
  const file = "revocations_matrix_distribution_by_district";

  describe("when user is authenticated", () => {
    beforeAll(() => {
      UserStore.mockImplementationOnce(() => {
        return {
          user: mockUser,
          userIsLoading: false,
          getTokenSilently: mockGetTokenSilently,
        };
      });

      rootStore = new RootStore();
      baseStore = new BaseDataStore({ rootStore, file });
    });

    afterAll(() => {
      jest.resetAllMocks();
    });

    describe("default store properties", () => {
      it("has a reference to the rootStore", () => {
        expect(baseStore.rootStore).toBeDefined();
      });

      it("sets eagerExpand to false'", () => {
        expect(baseStore.eagerExpand).toBe(false);
      });
    });

    describe("fetchData", () => {
      it("makes a request to the correct endpoint for the apiData", () => {
        const expectedEndpoint = `${tenantId}/newRevocations/revocations_matrix_distribution_by_district
        ?metricPeriodMonths=12&chargeCategory=All&supervisionType=All
        &supervisionLevel=All&district[0]=All`.replace(/\n\s+/g, "");

        expect(callMetricsApi).toHaveBeenCalledTimes(1);
        expect(callMetricsApi).toHaveBeenCalledWith(
          expectedEndpoint,
          mockGetTokenSilently
        );
      });

      it("sets isLoading to false and isError to false", () => {
        expect(baseStore.isLoading).toEqual(false);
        expect(baseStore.isError).toEqual(false);
      });

      it("sets apiData", () => {
        expect(baseStore.apiData).toEqual([["0"], ["0"]]);
      });

      describe("when API responds with an error", () => {
        beforeAll(() => {
          callMetricsApi.mockRejectedValueOnce(new Error("API Error"));
          baseStore = new BaseDataStore({ rootStore, file });
        });

        it("does not set apiData", () => {
          expect(baseStore.apiData).toStrictEqual([]);
        });

        it("sets isError to true and isLoading to false", () => {
          expect(baseStore.isError).toBe(true);
          expect(baseStore.isLoading).toBe(false);
        });
      });
    });
  });

  describe("when user is pending authentication", () => {
    beforeAll(() => {
      jest.resetAllMocks();
      UserStore.mockImplementationOnce(() => {
        return {
          user: null,
          userIsLoading: true,
          getTokenSilently: mockGetTokenSilently,
        };
      });
      rootStore = new RootStore();
      baseStore = new BaseDataStore({ rootStore, file });
    });

    afterAll(() => {
      jest.resetAllMocks();
    });

    it("does not fetch data", () => {
      expect(callMetricsApi).toHaveBeenCalledTimes(0);
    });

    it("sets isError to false and isLoading to false", () => {
      expect(baseStore.isError).toBe(false);
      expect(baseStore.isLoading).toBe(true);
    });
  });
});
