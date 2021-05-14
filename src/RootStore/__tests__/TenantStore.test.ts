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
import TenantStore, {
  CURRENT_TENANT_IN_SESSION,
} from "../TenantStore/TenantStore";
import { US_MO, US_PA } from "../TenantStore/lanternTenants";
import RootStore from "..";
import UserStore from "../UserStore";

jest.mock("@auth0/auth0-spa-js");
jest.mock("../../api/metrics/metricsClient");
jest.mock("../../components/StoreProvider");

const METADATA_NAMESPACE = process.env.REACT_APP_METADATA_NAMESPACE;

const metadataField = `${METADATA_NAMESPACE}app_metadata`;
const user = { [metadataField]: { state_code: US_MO }, email_verified: true };

let tenantStore;
describe("TenantStore", () => {
  const tenantIdFromStorage = "TEST_TENANT";
  const tenantIdFromUser = US_MO;

  const createMockRootStore = (mockUserStore: any) =>
    ({
      userStore: mockUserStore as UserStore,
    } as typeof RootStore);

  describe("enableUserRestrictions", () => {
    it("returns true when a current tenant has restrictions enabled", () => {
      const mockRootStore = createMockRootStore({
        userIsLoading: false,
        availableStateCodes: ["US_MO"],
        userRestrictions: ["25"],
        userHasAccess: () => true,
        user,
      });
      tenantStore = new TenantStore({
        rootStore: mockRootStore,
      });
      expect(tenantStore.enableUserRestrictions).toEqual(true);
    });
    it("returns false when a current tenant does not have restrictions enabled", () => {
      const mockRootStore = createMockRootStore({
        userIsLoading: false,
        availableStateCodes: ["US_PA"],
        userRestrictions: [],
        userHasAccess: () => true,
        user: { [metadataField]: { state_code: US_PA }, email_verified: true },
      });
      tenantStore = new TenantStore({
        rootStore: mockRootStore,
      });
      expect(tenantStore.enableUserRestrictions).toEqual(false);
    });

    it("returns true for recidiviz users with restrictions", () => {
      const mockRootStore = createMockRootStore({
        userIsLoading: false,
        availableStateCodes: ["US_MO", "US_PA"],
        userRestrictions: ["25"],
        userHasAccess: () => true,
        user: {
          [metadataField]: { state_code: "recidiviz" },
          email_verified: true,
        },
      });
      tenantStore = new TenantStore({
        rootStore: mockRootStore,
      });
      expect(tenantStore.enableUserRestrictions).toEqual(true);
    });
    it("returns false for recidiviz users without restrictions", () => {
      const mockRootStore = createMockRootStore({
        userIsLoading: false,
        availableStateCodes: ["US_MO", "US_PA"],
        userRestrictions: [],
        userHasAccess: () => true,
        user: {
          [metadataField]: { state_code: "recidiviz" },
          email_verified: true,
        },
      });
      tenantStore = new TenantStore({
        rootStore: mockRootStore,
      });
      expect(tenantStore.enableUserRestrictions).toEqual(false);
    });

    it("returns false for restrictions in the wrong format", () => {
      const mockRootStore = createMockRootStore({
        userIsLoading: false,
        availableStateCodes: ["US_MO"],
        userRestrictions: "some string",
        userHasAccess: () => true,
        user: {
          [metadataField]: { state_code: "US_MO" },
          email_verified: true,
        },
      });
      tenantStore = new TenantStore({
        rootStore: mockRootStore,
      });
      expect(tenantStore.enableUserRestrictions).toEqual(false);
    });
  });

  describe("when there is a CURRENT_TENANT_IN_SESSION", () => {
    beforeEach(() => {
      sessionStorage.setItem(CURRENT_TENANT_IN_SESSION, tenantIdFromStorage);
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("currentTenantId is set to CURRENT_TENANT_IN_SESSION if there is not a user", async () => {
      const mockRootStore = createMockRootStore({
        userIsLoading: false,
        availableStateCodes: [],
        userHasAccess: () => false,
      });
      tenantStore = new TenantStore({
        rootStore: mockRootStore,
      });
      expect(tenantStore.currentTenantId).toEqual(tenantIdFromStorage);
    });

    it("currentTenantId is set to CURRENT_TENANT_IN_SESSION if the user has access", async () => {
      const mockRootStore = createMockRootStore({
        userIsLoading: false,
        availableStateCodes: [tenantIdFromUser],
        userHasAccess: () => true,
        user,
      });
      tenantStore = new TenantStore({
        rootStore: mockRootStore,
      });

      expect(tenantStore.currentTenantId).toEqual(tenantIdFromStorage);
    });

    it("currentTenantId is set to availableStateCodes if the user does not have access", async () => {
      const availableStateCodes = ["BARNEY", "RUBBLE"];
      const mockRootStore = createMockRootStore({
        userIsLoading: false,
        availableStateCodes,
        userHasAccess: () => false,
        user,
      });

      tenantStore = new TenantStore({
        rootStore: mockRootStore,
      });
      expect(tenantStore.currentTenantId).toEqual(availableStateCodes[0]);
    });
  });
});
