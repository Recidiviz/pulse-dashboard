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
import { runInAction } from "mobx";

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
          dimension_manifest: [
            ["metric_period_months", ["12"]],
            ["charge_category", ["all"]],
            ["reported_violations", ["all"]],
            ["violation_type", ["felony"]],
            ["supervision_level", ["all"]],
            ["supervision_type", ["all"]],
            ["district", ["all"]],
          ],
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
          restrictedDistrictIsLoading: false,
        };
      });

      rootStore = new RootStore();
      baseStore = new BaseDataStore({ rootStore, file });
    });

    describe("default store properties", () => {
      it("has a reference to the rootStore", () => {
        expect(baseStore.rootStore).toBeDefined();
      });

      it("sets eagerExpand to false'", () => {
        expect(baseStore.eagerExpand).toBe(false);
      });

      it("throws an error if filteredData is accessed by the parent class", () => {
        expect(() => baseStore.filteredData).toThrowError(
          `filteredData should be defined in the subclass.`
        );
      });
    });

    describe("fetchData", () => {
      it("makes a request to the correct endpoint for the apiData", () => {
        const expectedEndpoint = `${tenantId}/newRevocations/revocations_matrix_distribution_by_district
        ?metricPeriodMonths=12&chargeCategory=All&reportedViolations=All&violationType=All&supervisionType=All
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

      it("sets both the data and metadata values as apiData", () => {
        expect(baseStore.apiData.data).toEqual([["0"], ["0"]]);
        expect(baseStore.apiData.metadata).toEqual({
          total_data_points: 1,
          dimension_manifest: [
            ["metric_period_months", ["12"]],
            ["charge_category", ["all"]],
            ["reported_violations", ["all"]],
            ["violation_type", ["felony"]],
            ["supervision_level", ["all"]],
            ["supervision_type", ["all"]],
            ["district", ["all"]],
          ],
          value_keys: ["population_count"],
        });
      });

      describe("when API responds with an error", () => {
        beforeAll(() => {
          callMetricsApi.mockRejectedValueOnce(new Error("API Error"));
          baseStore = new BaseDataStore({ rootStore, file });
        });

        it("does not set apiData", () => {
          expect(baseStore.apiData).toStrictEqual({});
        });

        it("sets isError to true and isLoading to false", () => {
          expect(baseStore.isError).toBe(true);
          expect(baseStore.isLoading).toBe(false);
        });
      });
    });
  });

  describe("when a filter value is not included in the dimension manifest", () => {
    beforeEach(() => {
      baseStore = new BaseDataStore({ rootStore, file });
      rootStore.filtersStore.setFilters({
        violationType: "FELONY",
      });
    });

    it("fetches a new subset file with new filter query params", () => {
      const expectedEndpoint = `${tenantId}/newRevocations/revocations_matrix_distribution_by_district?
      metricPeriodMonths=12&chargeCategory=All&reportedViolations=All&violationType=LAW&
      supervisionType=All&supervisionLevel=All&district[0]=All`.replace(
        /\n\s+/g,
        ""
      );

      rootStore.filtersStore.setFilters({
        violationType: "LAW",
      });

      expect(callMetricsApi).toHaveBeenCalledWith(
        expectedEndpoint,
        mockGetTokenSilently
      );
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
          restrictedDistrictIsLoading: false,
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

  describe("when restrictedDistrict is loading", () => {
    beforeAll(() => {
      jest.resetAllMocks();
      UserStore.mockImplementationOnce(() => {
        return {
          user: mockUser,
          userIsLoading: false,
          getTokenSilently: mockGetTokenSilently,
          restrictedDistrictIsLoading: true,
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

  describe("when the tenant is not a Lantern tenant", () => {
    beforeAll(() => {
      jest.resetAllMocks();
      UserStore.mockImplementationOnce(() => {
        return {
          user: mockUser,
          userIsLoading: false,
          getTokenSilently: false,
        };
      });
      rootStore = new RootStore();
      runInAction(() => {
        rootStore.tenantStore.currentTenantId = "US_ND";
        baseStore = new BaseDataStore({ rootStore, file });
      });
    });

    afterAll(() => {
      jest.resetAllMocks();
    });

    it("does not fetch data", () => {
      expect(callMetricsApi).toHaveBeenCalledTimes(0);
    });

    it("sets isError to false and isLoading to false", () => {
      expect(baseStore.isError).toBe(false);
      expect(baseStore.isLoading).toBe(false);
    });
  });
});
