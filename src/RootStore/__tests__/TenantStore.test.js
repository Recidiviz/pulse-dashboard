// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
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
import { CURRENT_TENANT_IN_SESSION } from "../TenantStore";
import { useAuth0 } from "../../react-auth0-spa";
import { US_MO } from "../../views/tenants/utils/lanternTenants";
import { doesUserHaveAccess, getAvailableStateCodes } from "../utils/user";
import { METADATA_NAMESPACE } from "../../constants";

jest.mock("../../react-auth0-spa");
jest.mock("../../utils/authentication/user");

let rootStore;
const metadataField = `${METADATA_NAMESPACE}app_metadata`;
const user = { [metadataField]: { state_code: US_MO } };

describe("TenantStore", () => {
  const tenantId = "US_MO";

  describe("when there is a CURRENT_TENANT_IN_SESSION", () => {
    beforeEach(() => {
      sessionStorage.setItem(CURRENT_TENANT_IN_SESSION, tenantId);
      jest.clearAllMocks();
    });

    it("currentTenantId is set to CURRENT_TENANT_IN_SESSION if there is not a user", () => {
      useAuth0.mockReturnValue({});

      rootStore = new RootStore();
      expect(rootStore.tenantStore.currentTenantId).toEqual(tenantId);
    });

    it("currentTenantId is set to CURRENT_TENANT_IN_SESSION if the user has access", () => {
      useAuth0.mockReturnValue({
        user,
        isAuthenticated: true,
        loading: false,
        loginWithRedirect: jest.fn(),
        getTokenSilently: jest.fn(),
      });
      doesUserHaveAccess.mockReturnValue(true);

      rootStore = new RootStore();
      expect(rootStore.tenantStore.currentTenantId).toEqual(tenantId);
    });

    it("currentTenantId is set to availableStateCodes if the user does not have access", () => {
      useAuth0.mockReturnValue({
        user,
        isAuthenticated: true,
        loading: false,
        loginWithRedirect: jest.fn(),
        getTokenSilently: jest.fn(),
      });
      const availableStateCodes = ["US_MO", "US_PA"];
      doesUserHaveAccess.mockReturnValue(false);
      getAvailableStateCodes.mockReturnValue(availableStateCodes);

      rootStore = new RootStore();
      expect(rootStore.tenantStore.currentTenantId).toEqual(
        availableStateCodes[0]
      );
    });
  });
});
