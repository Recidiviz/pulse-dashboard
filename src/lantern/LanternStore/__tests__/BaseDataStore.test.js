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
import * as Sentry from "@sentry/react";
import * as sharedFilters from "shared-filters";
import BaseDataStore, {
  DEFAULT_IGNORED_DIMENSIONS,
} from "../DataStore/BaseDataStore";

import UserRestrictedAccessStore from "../UserRestrictedAccessStore";
import LanternStore from "..";
import { METADATA_NAMESPACE } from "../../../constants";
import { callMetricsApi } from "../../../api/metrics/metricsClient";
import DistrictsStore from "../DistrictsStore";

let lanternStore;
let baseStore;
const mockTenantId = "US_MO";
const metadataField = `${METADATA_NAMESPACE}app_metadata`;
const mockUser = { [metadataField]: { state_code: mockTenantId } };
const mockFilterOptimizedDataFormat = sharedFilters.filterOptimizedDataFormat;
const mockGetTokenSilently = jest.fn();

jest.mock("@sentry/react");
jest.mock("../UserRestrictedAccessStore");
jest.mock("../DistrictsStore");
jest.mock("../DataStore/MatrixStore");
jest.mock("../DataStore/CaseTableStore");
jest.mock("../DataStore/RevocationsChartStore");
jest.mock("../DataStore/RevocationsOverTimeStore");
jest.mock("shared-filters", () => {
  return {
    ...jest.requireActual("shared-filters"),
    filterOptimizedDataFormat: jest.fn(),
  };
});
jest.mock("../../../api/metrics/metricsClient", () => {
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
          value_keys: ["revocation_count"],
        },
      },
    }),
  };
});

const mockRootStore = {
  tenantStore: {
    currentTenantId: mockTenantId,
    isLanternTenant: true,
  },
  userStore: {
    user: mockUser,
    userIsLoading: false,
    getTokenSilently: mockGetTokenSilently,
  },
};

describe("BaseDataStore", () => {
  const file = "revocations_matrix_distribution_by_district";

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  beforeAll(() => {
    DistrictsStore.mockImplementation(() => {
      return {
        apiData: { data: [] },
        districtKeys: {
          filterKey: "levelOneSupervisionLocation",
        },
      };
    });
    UserRestrictedAccessStore.mockImplementation(() => {
      return {
        isLoading: false,
      };
    });
  });

  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  describe("when user is authenticated", () => {
    beforeEach(() => {
      lanternStore = new LanternStore(mockRootStore);
    });

    describe("default store properties", () => {
      beforeEach(() => {
        baseStore = new BaseDataStore({ rootStore: lanternStore, file });
      });

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

      it("sets ignoredSubsetDimensions to the default values", () => {
        expect(baseStore.ignoredSubsetDimensions).toEqual(
          DEFAULT_IGNORED_DIMENSIONS
        );
      });
    });

    describe("filterData", () => {
      const mockDataFilter = jest.fn((item) => {
        return item.violation_type === "law";
      });

      beforeEach(() => {
        baseStore = new BaseDataStore({ rootStore: lanternStore, file });
        mockDataFilter.mockClear();
      });

      it("returns an empty array when data is not set", () => {
        expect(baseStore.filterData({}, mockDataFilter)).toEqual([]);
        expect(mockFilterOptimizedDataFormat.mock.calls.length).toEqual(0);
      });

      it("filters data when eagerExpand is true", () => {
        baseStore.eagerExpand = true;
        const data = [{ violation_type: "all" }, { violation_type: "law" }];
        expect(baseStore.filterData({ data }, mockDataFilter)).toEqual([
          data[1],
        ]);
        expect(mockDataFilter).toHaveBeenCalledTimes(data.length);
      });

      it("filters data when it is in the expanded format", () => {
        const data = [{ violation_type: "all" }, { violation_type: "law" }];
        expect(baseStore.filterData({ data }, mockDataFilter)).toEqual([
          data[1],
        ]);
        expect(mockDataFilter).toHaveBeenCalledTimes(data.length);
      });

      it("calls filterOptimizedDataFormat when it is the optimized data format", () => {
        const data = [
          ["1", "2", "3"],
          ["4", "5", "6"],
        ];
        const metadata = { total_data_points: 3 };
        baseStore.filterData({ data, metadata }, mockDataFilter);
        expect(mockDataFilter).toHaveBeenCalledTimes(0);
        expect(mockFilterOptimizedDataFormat).toHaveBeenCalledTimes(1);
        expect(mockFilterOptimizedDataFormat).toHaveBeenCalledWith(
          data,
          metadata,
          mockDataFilter
        );
      });
    });

    describe("fetchData", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        baseStore = new BaseDataStore({ rootStore: lanternStore, file });
      });

      it("makes a request to the correct endpoint for the apiData", () => {
        const expectedEndpoint = `${mockTenantId}/newRevocations/revocations_matrix_distribution_by_district
        ?metricPeriodMonths=12&chargeCategory=All&reportedViolations=All&violationType=All&supervisionType=All
        &supervisionLevel=All&levelOneSupervisionLocation[0]=All&levelTwoSupervisionLocation[0]=All&
        admissionType[0]=All`.replace(/\n\s+/g, "");

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
          value_keys: ["revocation_count"],
        });
      });

      describe("when API responds with an error", () => {
        const apiError = new Error("API Error");
        beforeEach(() => {
          callMetricsApi.mockRejectedValueOnce(apiError);
          baseStore = new BaseDataStore({ rootStore: lanternStore, file });
        });

        it("does not set apiData", () => {
          expect(baseStore.apiData).toStrictEqual({});
        });

        it("sets isError to true and isLoading to false", () => {
          expect(baseStore.isError).toBe(true);
          expect(baseStore.isLoading).toBe(false);
        });

        it("sends an error and context information to Sentry", () => {
          expect(Sentry.captureException).toHaveBeenCalledWith(
            apiError,
            expect.any(Function)
          );
        });
      });
    });
  });

  describe("when a filter value is not included in the dimension manifest", () => {
    beforeEach(() => {
      lanternStore = new LanternStore(mockRootStore);
      baseStore = new BaseDataStore({ rootStore: lanternStore, file });
      lanternStore.filtersStore.setFilters({
        violationType: "FELONY",
      });
    });

    it("fetches a new subset file with new filter query params", () => {
      const expectedEndpoint = `${mockTenantId}/newRevocations/revocations_matrix_distribution_by_district?
      metricPeriodMonths=12&chargeCategory=All&reportedViolations=All&violationType=All&
      supervisionType=All&supervisionLevel=All&levelOneSupervisionLocation[0]=All&
      levelTwoSupervisionLocation[0]=All&admissionType[0]=All`.replace(
        /\n\s+/g,
        ""
      );

      lanternStore.filtersStore.setFilters({
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

      lanternStore = new LanternStore({
        ...mockRootStore,
        userStore: {
          user: null,
          userIsLoading: true,
          getTokenSilently: mockGetTokenSilently,
        },
      });
      baseStore = new BaseDataStore({ rootStore: lanternStore, file });
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

  describe("when user restricted access is loading", () => {
    beforeAll(() => {
      jest.resetAllMocks();
      UserRestrictedAccessStore.mockImplementationOnce(() => {
        return {
          isLoading: true,
        };
      });
      lanternStore = new LanternStore(mockRootStore);
      baseStore = new BaseDataStore({ rootStore: lanternStore, file });
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
    beforeEach(() => {
      lanternStore = new LanternStore({
        ...mockRootStore,
        tenantStore: {
          currentTenantId: "US_ND",
          isLanternTenant: false,
        },
        userStore: {
          user: mockUser,
          userIsLoading: false,
          getTokenSilently: mockGetTokenSilently,
        },
      });
      baseStore = new BaseDataStore({ rootStore: lanternStore, file });
    });

    afterEach(() => {
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
