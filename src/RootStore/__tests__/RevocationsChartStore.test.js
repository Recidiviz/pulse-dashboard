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
import RootStore from "../RootStore";
import { useAuth0 } from "../../react-auth0-spa";
import { METADATA_NAMESPACE } from "../../utils/authentication/user";
import { callMetricsApi } from "../../api/metrics/metricsClient";

let rootStore;
let dataStore;

jest.mock("../DataStore/MatrixStore");
jest.mock("../DataStore/CaseTableStore");
jest.mock("../DataStore/RevocationsOverTimeStore");
jest.mock("../../react-auth0-spa");
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

describe("RevocationsChartStore", () => {
  const mockGetTokenSilently = jest.fn();

  describe("when user is authenticated", () => {
    beforeAll(() => {
      useAuth0.mockReturnValue({
        user: mockUser,
        getTokenSilently: mockGetTokenSilently,
        loading: false,
      });
      rootStore = new RootStore();
      dataStore = rootStore.dataStore.revocationsChartStore;
    });

    afterAll(() => {
      jest.resetAllMocks();
    });

    describe("default store properties", () => {
      it("has a reference to the rootStore", () => {
        expect(dataStore.rootStore).toBeDefined();
      });

      it("sets default selectedChart to 'District'", () => {
        expect(dataStore.selectedChart).toEqual("District");
      });

      it("sets eagerExpand to false'", () => {
        expect(dataStore.eagerExpand).toBe(false);
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
        expect(dataStore.isLoading).toEqual(false);
        expect(dataStore.isError).toEqual(false);
      });

      it("sets apiData", () => {
        expect(dataStore.apiData).toEqual([["0"], ["0"]]);
      });

      it("sets filteredData", () => {
        expect(dataStore.filteredData).toEqual([
          { population_count: "0", reported_violations: "0" },
        ]);
      });
    });
  });

  describe("when API responds with an error", () => {
    beforeAll(() => {
      jest.resetAllMocks();
      useAuth0.mockReturnValue({
        user: mockUser,
        getTokenSilently: mockGetTokenSilently,
        loading: false,
      });
      callMetricsApi.mockRejectedValueOnce(new Error("API Error"));
      rootStore = new RootStore();
      dataStore = rootStore.dataStore.revocationsChartStore;
    });

    afterAll(() => {
      jest.resetAllMocks();
    });

    it("does not set apiData or filteredData", () => {
      expect(dataStore.apiData).toStrictEqual([]);
      expect(dataStore.filteredData).toStrictEqual([]);
    });

    it("sets isError to true and isLoading to false", () => {
      expect(dataStore.isError).toBe(true);
      expect(dataStore.isLoading).toBe(false);
    });
  });

  describe("when user is pending authentication", () => {
    beforeAll(() => {
      jest.resetAllMocks();
      useAuth0.mockReturnValue({
        user: mockUser,
        getTokenSilently: mockGetTokenSilently,
        loading: true,
      });
      rootStore = new RootStore();
      dataStore = rootStore.dataStore.revocationsChartStore;
    });

    afterAll(() => {
      jest.resetAllMocks();
    });

    it("does not fetch data", () => {
      expect(callMetricsApi).toHaveBeenCalledTimes(0);
    });

    it("sets isError to false and isLoading to false", () => {
      expect(dataStore.isError).toBe(false);
      expect(dataStore.isLoading).toBe(true);
    });
  });
});
