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
import { reactImmediately } from "../../../testUtils";
import UserRestrictedAccessStore from "../UserRestrictedAccessStore";
import type UserStore from "../../../RootStore/UserStore";
import type TenantStore from "../../../RootStore/TenantStore";
import { METADATA_NAMESPACE, ERROR_MESSAGES } from "../../../constants";
import { callRestrictedAccessApi } from "../../../api/metrics/metricsClient";
import LanternStore from "..";

jest.mock("@sentry/react");
jest.mock("..");
jest.mock("../../../api/metrics/metricsClient");

const mockCallRestrictedAccessApi = callRestrictedAccessApi as jest.Mock;
const mockLanternStore = LanternStore as jest.Mock;
const mockGetTokenSilently = jest.fn();
const mockSetAuthError = jest.fn();

const userEmail = "thirteen@mo.gov";
const userDistrict = "13";
const authError = new Error(ERROR_MESSAGES.unauthorized);
const apiError = new Error("API Failed");
const tenantId = "US_MO";
const metadata = `${METADATA_NAMESPACE}app_metadata`;
const mockUser = { email: userEmail, [metadata]: { state_code: tenantId } };
const mockRootStore = {
  userStore: {} as UserStore,
  tenantStore: {} as TenantStore,
};
const additionalRestrictedDistrict = "TCSTL";

describe("fetchRestrictedDistrictData", () => {
  let userRestrictedAccessStore: UserRestrictedAccessStore;
  let endpoint: string;
  let rootStore: LanternStore;
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation();
    mockLanternStore.mockImplementation(() => {
      return {
        currentTenantId: tenantId,
        tenantStore: {
          isLanternTenant: true,
          isRestrictedDistrictTenant: true,
        },
        districtsStore: {
          isLoading: false,
          districtIds: [userDistrict, additionalRestrictedDistrict],
        },
        userStore: {
          availableStateCodes: [tenantId],
          user: mockUser,
          userIsLoading: false,
          getTokenSilently: mockGetTokenSilently,
          setAuthError: mockSetAuthError,
        },
      };
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe("when API responds with success", () => {
    beforeEach(async () => {
      mockCallRestrictedAccessApi.mockResolvedValue({
        supervision_location_restricted_access_emails: {
          restricted_user_email: userEmail.toUpperCase(),
          allowed_level_1_supervision_location_ids: userDistrict,
        },
      });

      reactImmediately(() => {
        userRestrictedAccessStore = new UserRestrictedAccessStore({
          rootStore: new LanternStore(mockRootStore),
        });
      });

      endpoint = `${tenantId}/restrictedAccess`;
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("makes a request to the correct endpoint for the data", () => {
      expect(callRestrictedAccessApi).toHaveBeenCalledTimes(1);
      expect(callRestrictedAccessApi).toHaveBeenCalledWith(
        endpoint,
        userEmail,
        userRestrictedAccessStore.rootStore?.userStore
      );
    });

    it("sets isLoading to false", () => {
      expect(userRestrictedAccessStore.isLoading).toEqual(false);
    });

    it("sets the restrictedDistricts", () => {
      expect(userRestrictedAccessStore.restrictedDistricts).toEqual([
        userDistrict,
      ]);
    });

    it("enabledRevocationsCharts is based on tenantId and user restrictions", () => {
      expect(userRestrictedAccessStore.enabledRevocationsCharts).toEqual([
        "District",
        "Officer",
        "Risk level",
        "Violation",
      ]);
    });

    describe("when tenantId is not US_MO", () => {
      it("does not restrict the enabledRevocationsCharts", () => {
        mockLanternStore.mockImplementationOnce(() => {
          return {
            currentTenantId: "US_PA",
            tenantStore: {
              isLanternTenant: true,
              isRestrictedDistrictTenant: true,
            },
            districtsStore: {
              isLoading: false,
              districtIds: [userDistrict, additionalRestrictedDistrict],
            },
            userStore: {
              availableStateCodes: ["US_PA"],
              user: mockUser,
              userIsLoading: false,
              getTokenSilently: mockGetTokenSilently,
              setAuthError: mockSetAuthError,
            },
          };
        });
        reactImmediately(() => {
          userRestrictedAccessStore = new UserRestrictedAccessStore({
            rootStore: new LanternStore(mockRootStore),
          });
        });
        expect(userRestrictedAccessStore.enabledRevocationsCharts).toEqual([
          "District",
          "Officer",
          "Risk level",
          "Violation",
          "Gender",
          "Race",
        ]);
      });
    });
  });

  describe("when the user has more than one restricted district", () => {
    beforeEach(async () => {
      mockCallRestrictedAccessApi.mockResolvedValue({
        supervision_location_restricted_access_emails: {
          restricted_user_email: userEmail.toUpperCase(),
          allowed_level_1_supervision_location_ids: `${userDistrict}, ${additionalRestrictedDistrict}`,
        },
      });

      reactImmediately(() => {
        userRestrictedAccessStore = new UserRestrictedAccessStore({
          rootStore: new LanternStore(mockRootStore),
        });
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("includes all the districts in the array of values", () => {
      expect(userRestrictedAccessStore.restrictedDistricts).toEqual([
        userDistrict,
        additionalRestrictedDistrict,
      ]);
    });
  });

  describe("when the restrictedDistrict is invalid", () => {
    const invalidId = "INVALID_DISRTRICT_ID";

    beforeEach(async () => {
      mockCallRestrictedAccessApi.mockResolvedValue({
        supervision_location_restricted_access_emails: {
          restricted_user_email: userEmail.toUpperCase(),
          allowed_level_1_supervision_location_ids: invalidId,
        },
      });

      rootStore = new LanternStore(mockRootStore);

      userRestrictedAccessStore = new UserRestrictedAccessStore({
        rootStore,
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("sets an authError", () => {
      expect(rootStore.userStore.setAuthError).toHaveBeenCalledTimes(1);
    });

    it("keeps restrictedDistricts as an empty array and isLoading to false", () => {
      expect(userRestrictedAccessStore.restrictedDistricts).toEqual([]);
      expect(userRestrictedAccessStore.isLoading).toBe(false);
    });

    it("sends authError and context information to Sentry", () => {
      expect(Sentry.captureException).toHaveBeenCalledWith(authError, {
        tags: {
          restrictedDistrict: invalidId,
        },
      });
    });
  });

  describe("when districts is loading", () => {
    beforeEach(async () => {
      mockLanternStore.mockImplementationOnce(() => {
        return {
          currentTenantId: "US_ND",
          tenantStore: {
            isLanternTenant: false,
          },
          districtsStore: {
            isLoading: true,
            districtIds: null,
          },
          userStore: {
            user: mockUser,
            userIsLoading: false,
            getTokenSilently: mockGetTokenSilently,
            setAuthError: mockSetAuthError,
          },
        };
      });

      reactImmediately(() => {
        userRestrictedAccessStore = new UserRestrictedAccessStore({
          rootStore: new LanternStore(mockRootStore),
        });
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("does not call the API", () => {
      expect(callRestrictedAccessApi).toHaveBeenCalledTimes(0);
    });
  });

  describe("when user is loading", () => {
    beforeEach(async () => {
      mockLanternStore.mockImplementationOnce(() => {
        return {
          currentTenantId: "US_ND",
          tenantStore: {
            isLanternTenant: false,
          },
          districtsStore: {
            isLoading: true,
            districtIds: null,
          },
          userStore: {
            user: null,
            userIsLoading: true,
            getTokenSilently: mockGetTokenSilently,
            setAuthError: mockSetAuthError,
          },
        };
      });

      reactImmediately(() => {
        userRestrictedAccessStore = new UserRestrictedAccessStore({
          rootStore: new LanternStore(mockRootStore),
        });
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("does not call the API", () => {
      expect(callRestrictedAccessApi).toHaveBeenCalledTimes(0);
    });
  });

  describe("when API responds with an error", () => {
    beforeEach(async () => {
      mockCallRestrictedAccessApi.mockRejectedValueOnce(apiError);

      rootStore = new LanternStore(mockRootStore);

      userRestrictedAccessStore = new UserRestrictedAccessStore({
        rootStore,
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it("restrictedDistricts is an empty array", () => {
      expect(userRestrictedAccessStore.restrictedDistricts).toEqual([]);
    });

    it("sets an authError and restrictedDistrictIsLoading to false", () => {
      expect(rootStore.userStore.setAuthError).toHaveBeenCalledWith(authError);
      expect(userRestrictedAccessStore.isLoading).toBe(false);
    });

    it("sends the apiError and context information to Sentry", () => {
      expect(Sentry.captureException).toHaveBeenCalledWith(apiError, {
        tags: {
          availableStateCodes: tenantId,
          endpoint: `${tenantId}/restrictedAccess`,
          tenantId,
        },
      });
    });
  });

  describe("when the tenant is not in RESTRICTED_DISTRICT_TENANTS", () => {
    beforeEach(async () => {
      mockLanternStore.mockImplementationOnce(() => {
        return {
          currentTenantId: "US_PA",
          tenantStore: {
            isLanternTenant: false,
          },
          districtsStore: {
            isLoading: false,
            districtIds: [userDistrict],
          },
          userStore: {
            user: mockUser,
            userIsLoading: false,
            getTokenSilently: mockGetTokenSilently,
            setAuthError: mockSetAuthError,
          },
        };
      });

      reactImmediately(() => {
        userRestrictedAccessStore = new UserRestrictedAccessStore({
          rootStore: new LanternStore(mockRootStore),
        });
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("does not call the API", () => {
      expect(callRestrictedAccessApi).toHaveBeenCalledTimes(0);
    });

    it("sets isLoading to false", () => {
      expect(userRestrictedAccessStore.isLoading).toBeFalse();
    });
  });
});
