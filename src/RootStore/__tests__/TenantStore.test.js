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

import createAuth0Client from "@auth0/auth0-spa-js";

import RootStore from "../RootStore";
import { CURRENT_TENANT_IN_SESSION } from "../TenantStore/TenantStore";
import { US_MO } from "../TenantStore/lanternTenants";
import { doesUserHaveAccess, getAvailableStateCodes } from "../utils/user";
import { METADATA_NAMESPACE } from "../../constants";

jest.mock("@auth0/auth0-spa-js");
jest.mock("../utils/user");
jest.mock("../../components/StoreProvider");
jest.mock("../../api/metrics/metricsClient");
jest.mock("../DataStore/DataStore");

let rootStore;
const metadataField = `${METADATA_NAMESPACE}app_metadata`;
const user = { [metadataField]: { state_code: US_MO }, email_verified: true };

describe("TenantStore", () => {
  const tenantId = "TEST_TENANT";

  describe("when there is a CURRENT_TENANT_IN_SESSION", () => {
    beforeEach(() => {
      sessionStorage.setItem(CURRENT_TENANT_IN_SESSION, tenantId);
      jest.clearAllMocks();
    });

    it("currentTenantId is set to CURRENT_TENANT_IN_SESSION if there is not a user", async () => {
      createAuth0Client.mockResolvedValue({
        getUser: () => null,
        isAuthenticated: () => true,
      });
      doesUserHaveAccess.mockReturnValue(true);

      rootStore = new RootStore();
      await rootStore.userStore.authorize();
      expect(rootStore.tenantStore.currentTenantId).toEqual(tenantId);
    });

    it("currentTenantId is set to CURRENT_TENANT_IN_SESSION if the user has access", async () => {
      createAuth0Client.mockResolvedValue({
        getUser: () => user,
        isAuthenticated: () => true,
      });
      doesUserHaveAccess.mockReturnValue(true);

      rootStore = new RootStore();
      await rootStore.userStore.authorize();

      expect(rootStore.tenantStore.currentTenantId).toEqual(tenantId);
    });

    it("currentTenantId is set to availableStateCodes if the user does not have access", async () => {
      createAuth0Client.mockResolvedValue({
        getUser: () => user,
        isAuthenticated: () => true,
      });
      doesUserHaveAccess.mockReturnValue(false);

      const availableStateCodes = ["BARNEY", "RUBBLE"];
      getAvailableStateCodes.mockReturnValue(availableStateCodes);

      rootStore = new RootStore();
      await rootStore.userStore.authorize();

      expect(rootStore.tenantStore.currentTenantId).toEqual(
        availableStateCodes[0]
      );
    });
  });
});
