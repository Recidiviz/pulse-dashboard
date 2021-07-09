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

import { ERROR_MESSAGES } from "../../../constants";
import type TenantStore from "../../../RootStore/TenantStore";
import type UserStore from "../../../RootStore/UserStore";
import LanternStore from "..";
import UserRestrictionsStore from "../UserRestrictionsStore";

jest.mock("@sentry/react");
jest.mock("..");

const mockLanternStore = LanternStore as jest.Mock;
const mockSetAuthError = jest.fn();

let userDistrict = "13";
const authError = new Error(ERROR_MESSAGES.unauthorized);
const tenantId = "US_MO";
const mockRootStore = {
  userStore: {} as UserStore,
  tenantStore: {} as TenantStore,
};
const otherDistrict = "TCSTL";

describe("UserRestrictionsStore", () => {
  let userRestrictionsStore: UserRestrictionsStore;
  let rootStore: LanternStore;
  beforeEach(() => {
    mockLanternStore.mockImplementation(() => {
      return {
        currentTenantId: tenantId,
        districtsStore: {
          districtIds: [userDistrict, otherDistrict],
        },
        tenantStore: {
          enableUserRestrictions: true,
        },
        userStore: {
          setAuthError: mockSetAuthError,
          allowedSupervisionLocationIds: [userDistrict],
        },
      };
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe("when user has restrictions", () => {
    beforeEach(async () => {
      userRestrictionsStore = new UserRestrictionsStore({
        rootStore: new LanternStore(mockRootStore),
      });
    });

    it("enabledRevocationsCharts is based on tenantId and user restrictions", () => {
      expect(userRestrictionsStore.enabledRevocationsCharts).toEqual([
        "District",
        "Officer",
        "Risk level",
        "Violation",
      ]);
    });
  });

  describe("when user has restrictions and tenantId is not US_MO", () => {
    it("does not restrict the enabledRevocationsCharts", () => {
      mockLanternStore.mockImplementationOnce(() => {
        return {
          currentTenantId: "US_PA",
          districtsStore: {
            districtIds: [userDistrict, otherDistrict],
          },
          tenantStore: {
            enableUserRestrictions: true,
          },
          userStore: {
            setAuthError: mockSetAuthError,
            allowedSupervisionLocationIds: [userDistrict],
          },
        };
      });
      userRestrictionsStore = new UserRestrictionsStore({
        rootStore: new LanternStore(mockRootStore),
      });
      expect(userRestrictionsStore.enabledRevocationsCharts).toEqual([
        "District",
        "Officer",
        "Risk level",
        "Violation",
        "Gender",
        "Race",
      ]);
    });
  });

  describe("when the user restriction is invalid", () => {
    const mockInvalidId = "INVALID_DISRTRICT_ID";

    beforeEach(async () => {
      mockLanternStore.mockImplementationOnce(() => {
        return {
          currentTenantId: "US_PA",
          districtsStore: {
            districtIds: [userDistrict, otherDistrict],
          },
          userStore: {
            setAuthError: mockSetAuthError,
            allowedSupervisionLocationIds: [mockInvalidId],
          },
        };
      });
      rootStore = new LanternStore(mockRootStore);
      userRestrictionsStore = new UserRestrictionsStore({
        rootStore,
      });
      userRestrictionsStore.verifyUserRestrictions();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("sets an authError", () => {
      expect(rootStore.userStore.setAuthError).toHaveBeenCalledTimes(1);
    });

    it("sends authError and context information to Sentry", () => {
      expect(Sentry.captureException).toHaveBeenCalledWith(authError, {
        tags: {
          allowedSupervisionLocationIds: mockInvalidId,
        },
      });
    });
  });

  describe("when the user restriction is valid", () => {
    beforeEach(async () => {
      mockLanternStore.mockImplementationOnce(() => {
        return {
          currentTenantId: "US_MO",
          districtsStore: {
            districtIds: [userDistrict, otherDistrict],
          },
          userStore: {
            setAuthError: mockSetAuthError,
            allowedSupervisionLocationIds: [userDistrict],
          },
        };
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("does not set an auth error for numeric district", () => {
      userDistrict = "03";
      rootStore = new LanternStore(mockRootStore);
      userRestrictionsStore = new UserRestrictionsStore({
        rootStore,
      });
      userRestrictionsStore.verifyUserRestrictions();

      expect(rootStore.userStore.setAuthError).toHaveBeenCalledTimes(0);
    });

    it("does not set an auth error for string district", () => {
      userDistrict = "TSCL";
      rootStore = new LanternStore(mockRootStore);
      userRestrictionsStore = new UserRestrictionsStore({
        rootStore,
      });
      userRestrictionsStore.verifyUserRestrictions();

      expect(rootStore.userStore.setAuthError).toHaveBeenCalledTimes(0);
    });

    it("does not set an auth error for alphanumeric district", () => {
      userDistrict = "13N";
      rootStore = new LanternStore(mockRootStore);
      userRestrictionsStore = new UserRestrictionsStore({
        rootStore,
      });
      userRestrictionsStore.verifyUserRestrictions();

      expect(rootStore.userStore.setAuthError).toHaveBeenCalledTimes(0);
    });
  });

  describe("when the user restriction is valid but missing a leading 0", () => {
    const mockMalformedId = "3";

    beforeEach(async () => {
      mockLanternStore.mockImplementationOnce(() => {
        return {
          currentTenantId: "US_MO",
          districtsStore: {
            districtIds: ["03", "13N", "TSCL"],
          },
          userStore: {
            setAuthError: mockSetAuthError,
            allowedSupervisionLocationIds: [mockMalformedId],
          },
        };
      });
      rootStore = new LanternStore(mockRootStore);
      userRestrictionsStore = new UserRestrictionsStore({
        rootStore,
      });
      userRestrictionsStore.verifyUserRestrictions();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("does not set an auth error", () => {
      expect(rootStore.userStore.setAuthError).toHaveBeenCalledTimes(0);
    });

    it("correctly sets the allowedSupervisionLocationIds", () => {
      expect(userRestrictionsStore.allowedSupervisionLocationIds).toEqual([
        "03",
      ]);
    });
  });
});
