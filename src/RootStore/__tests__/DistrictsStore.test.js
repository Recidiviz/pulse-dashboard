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
import { reactImmediately } from "../../testUtils";
import { callMetricsApi } from "../../api/metrics/metricsClient";
import RootStore from "../RootStore";
import DistrictsStore from "../DistrictsStore";

jest.mock("@sentry/react");
jest.mock("../RootStore");
jest.mock("../../api/metrics/metricsClient");

const tenantId = "US_MO";
const mockGetTokenSilently = jest.fn();

const mockRootStore = {
  currentTenantId: tenantId,
  tenantStore: {
    isLanternTenant: true,
    tenants: {
      districtValueKey: "level_2_supervision_location_external_id",
      districtLabelKey: "level_2_supervision_location_external_id",
    },
  },
  userStore: {
    userIsLoading: false,
    getTokenSilently: mockGetTokenSilently,
  },
};

describe("DistrictsStore", () => {
  let store;

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("fetching districts", () => {
    const file = "supervision_location_ids_to_names";
    const mockDistricts = [
      {
        level_2_supervision_location_external_id: "TCSTL",
        level_2_supervision_location_name: "TCSTL",
        level_1_supervision_location_external_id: "SLCRC",
        level_1_supervision_location_name: "St. Louis Community Release Center",
      },
      {
        level_2_supervision_location_external_id: "TCSTL",
        level_2_supervision_location_name: "TCSTL",
        level_1_supervision_location_external_id: "TCSTL",
        level_1_supervision_location_name: "Transition Center of St. Louis",
      },
      {
        level_2_supervision_location_external_id: "ABCD",
        level_2_supervision_location_name: "ABCD",
        level_1_supervision_location_external_id: "ABCD-Level-1",
        level_1_supervision_location_name: "ABC Location",
      },
    ];

    beforeEach(() => {
      RootStore.mockImplementation(() => mockRootStore);

      callMetricsApi.mockResolvedValue({
        [file]: mockDistricts,
      });

      reactImmediately(() => {
        store = new DistrictsStore({
          rootStore: new RootStore(),
        });
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("has a reference to the rootStore", () => {
      expect(store.rootStore).toBeDefined();
    });

    it("makes a request to the correct endpoint for the data", () => {
      const endpoint = `${tenantId}/newRevocations/${file}`;
      expect(callMetricsApi).toHaveBeenCalledTimes(1);
      expect(callMetricsApi).toHaveBeenCalledWith(
        endpoint,
        mockGetTokenSilently
      );
    });

    it("sets isLoading to false and isError stays false ", () => {
      expect(store.isLoading).toEqual(false);
      expect(store.isError).toEqual(false);
    });

    it("sets the apiData", () => {
      expect(store.apiData.data).toEqual(mockDistricts);
      expect(store.apiData.metadata).toEqual({});
    });

    it("sets districts to a sorted list of all unique values", () => {
      expect(store.districts).toEqual(["ABCD", "TCSTL"]);
    });
  });

  describe("when there's an API error", () => {
    const apiError = new Error("API Error");
    beforeEach(() => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      RootStore.mockImplementation(() => mockRootStore);
      callMetricsApi.mockRejectedValueOnce(apiError);
      store = new DistrictsStore({ rootStore: new RootStore() });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("does not set apiData", () => {
      expect(store.apiData).toStrictEqual({});
    });

    it("sets isError to true and isLoading to false", () => {
      expect(store.isError).toBe(true);
      expect(store.isLoading).toBe(false);
    });

    it("sends an error and context information to Sentry", () => {
      expect(Sentry.captureException).toHaveBeenCalledWith(
        apiError,
        expect.any(Function)
      );
    });
  });

  describe("when the tenant is not a lantern tenant", () => {
    beforeEach(() => {
      RootStore.mockImplementation(() => {
        return {
          ...mockRootStore,
          tenantStore: {
            isLanternTenant: false,
          },
        };
      });
      reactImmediately(() => {
        store = new DistrictsStore({
          rootStore: new RootStore(),
        });
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("does not fetch districts", () => {
      expect(callMetricsApi).toHaveBeenCalledTimes(0);
    });

    it("sets isLoading to false and isError stays false ", () => {
      expect(store.isLoading).toEqual(false);
      expect(store.isError).toEqual(false);
    });
  });

  describe("when the userStore is still loading", () => {
    beforeEach(() => {
      RootStore.mockImplementation(() => {
        return {
          ...mockRootStore,
          userStore: {
            userIsLoading: true,
          },
        };
      });
    });

    it("does not fetch districts", () => {
      expect(callMetricsApi).toHaveBeenCalledTimes(0);
    });
  });
});
