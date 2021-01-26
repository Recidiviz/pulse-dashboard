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

import createAuth0Client from "@auth0/auth0-spa-js";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { reactImmediately } from "../../testUtils";
import UserStore from "../UserStore";
import { METADATA_NAMESPACE } from "../../constants";
import TENANTS from "../../tenants";
import { callRestrictedAccessApi } from "../../api/metrics/metricsClient";
import RootStore from "../RootStore";

jest.mock("@auth0/auth0-spa-js");
jest.mock("../RootStore");
jest.mock("../../api/metrics/metricsClient");

const mockCreateAuth0Client = createAuth0Client as jest.Mock;
const mockCallRestrictedAccessApi = callRestrictedAccessApi as jest.Mock;
const mockGetUser = jest.fn();
const mockHandleRedirectCallback = jest.fn();
const mockIsAuthenticated = jest.fn();
const mockLoginWithRedirect = jest.fn();
const mockRootStore = RootStore as jest.Mock;
const mockGetTokenSilently = jest.fn();

const tenantId = "US_MO";
const metadataField = `${METADATA_NAMESPACE}app_metadata`;
const metadata = { [metadataField]: { state_code: tenantId } };
const testAuthSettings = {
  domain: "example.com",
  client_id: "abc123",
  redirect_url: window.location.href,
};
const userEmail = "thirteen@mo.gov";
const userDistrict = "13";

beforeEach(() => {
  mockRootStore.mockImplementation(() => {
    return {
      currentTenantId: tenantId,
      tenantStore: {
        districts: [userDistrict],
      },
    };
  });
  mockGetUser.mockResolvedValue(metadata);
  mockCreateAuth0Client.mockResolvedValue({
    getUser: mockGetUser,
    handleRedirectCallback: mockHandleRedirectCallback,
    isAuthenticated: mockIsAuthenticated,
    loginWithRedirect: mockLoginWithRedirect,
    getTokenSilently: jest.fn(),
  });
});

afterEach(() => {
  jest.resetAllMocks();
});
test("authorization immediately pending", async () => {
  const store = new UserStore({});
  reactImmediately(() => {
    expect(store.isAuthorized).toBe(false);
    expect(store.userIsLoading).toBe(true);
  });
  expect.hasAssertions();
});

test("authorize requires Auth0 client settings", async () => {
  const store = new UserStore({});
  await store.authorize();
  reactImmediately(() => {
    const error = store.authError;
    expect(error?.message).toMatch(ERROR_MESSAGES.auth0Configuration);
  });
  expect.hasAssertions();
});

test("authorized when authenticated", async () => {
  mockIsAuthenticated.mockResolvedValue(true);
  mockGetUser.mockResolvedValue({ email_verified: true, ...metadata });

  const store = new UserStore({
    authSettings: testAuthSettings,
  });
  await store.authorize();
  reactImmediately(() => {
    expect(store.isAuthorized).toBe(true);
    expect(store.userIsLoading).toBe(false);
  });
  expect.hasAssertions();
});

test("redirect to Auth0 when unauthenticated", async () => {
  mockIsAuthenticated.mockResolvedValue(false);
  expect(mockLoginWithRedirect.mock.calls.length).toBe(0);

  const store = new UserStore({
    authSettings: testAuthSettings,
  });
  await store.authorize();
  expect(mockLoginWithRedirect.mock.calls.length).toBe(1);
  expect(mockLoginWithRedirect.mock.calls[0][0]).toEqual({
    appState: { targetUrl: window.location.href },
  });
});

test("requires email verification", async () => {
  mockGetUser.mockResolvedValue({ email_verified: false, ...metadata });
  mockIsAuthenticated.mockResolvedValue(true);

  const store = new UserStore({
    authSettings: testAuthSettings,
  });
  await store.authorize();

  reactImmediately(() => {
    expect(store.isAuthorized).toBe(false);
  });
  expect.hasAssertions();
});

test("handles Auth0 token params", async () => {
  mockHandleRedirectCallback.mockResolvedValue({});
  const auth0LoginParams = "code=123456&state=abcdef";
  const urlWithToken = new URL(window.location.href);
  urlWithToken.search = `?${auth0LoginParams}`;
  window.history.pushState({}, "Test", urlWithToken.href);

  // sanity check on our initial url state
  expect(window.location.href).toMatch(auth0LoginParams);

  const store = new UserStore({
    authSettings: testAuthSettings,
  });
  await store.authorize();

  expect(mockHandleRedirectCallback.mock.calls.length).toBe(1);
  expect(window.location.href).not.toMatch(auth0LoginParams);
});

test("redirect to targetUrl after callback", async () => {
  const targetUrl = "http://localhost/somePage?id=1";
  mockHandleRedirectCallback.mockResolvedValue({ appState: { targetUrl } });

  const auth0LoginParams = "code=123456&state=abcdef";
  const urlWithToken = new URL(window.location.href);
  urlWithToken.search = `?${auth0LoginParams}`;
  window.history.pushState({}, "Test", urlWithToken.href);

  const store = new UserStore({
    authSettings: testAuthSettings,
  });
  await store.authorize();
  expect(window.location.href).toBe(targetUrl);
});

test.each(Object.keys(TENANTS))(
  "gets metadata for the user %s",
  async (currentTenantId) => {
    const tenantMetadata = { [metadataField]: { state_code: currentTenantId } };
    mockIsAuthenticated.mockResolvedValue(true);
    mockGetUser.mockResolvedValue({
      email_verified: true,
      ...tenantMetadata,
    });

    const store = new UserStore({
      authSettings: testAuthSettings,
    });
    await store.authorize();
    reactImmediately(() => {
      expect(store.availableStateCodes).toBe(
        // TODO TS remove when tenants is ported to TS
        // @ts-ignore
        TENANTS[currentTenantId].availableStateCodes
      );
      expect(store.stateName).toBe(
        // TODO TS remove when tenants is ported to TS
        // @ts-ignore
        TENANTS[currentTenantId].name
      );
    });
    expect.hasAssertions();
  }
);

describe("fetchRestrictedDistrictData", () => {
  let userStore: UserStore;
  let endpoint: string;

  describe("when API responds with success", () => {
    beforeEach(async () => {
      mockCallRestrictedAccessApi.mockResolvedValue({
        supervision_location_restricted_access_emails: {
          restricted_user_email: userEmail.toUpperCase(),
          allowed_level_1_supervision_location_ids: userDistrict,
        },
      });

      reactImmediately(() => {
        userStore = new UserStore({
          authSettings: testAuthSettings,
          rootStore: new RootStore(),
        });

        userStore.user = { email: userEmail };
        userStore.getTokenSilently = mockGetTokenSilently;
        userStore.userIsLoading = false;
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
        mockGetTokenSilently
      );
    });

    it("sets isLoading to false and isError to false", () => {
      expect(userStore.restrictedDistrictIsLoading).toEqual(false);
    });

    it("sets the restrictedDistrict", () => {
      expect(userStore.restrictedDistrict).toEqual(userDistrict);
    });
  });

  describe("when the restrictedDistrict is invalid", () => {
    beforeEach(async () => {
      mockCallRestrictedAccessApi.mockResolvedValue({
        supervision_location_restricted_access_emails: {
          restricted_user_email: userEmail.toUpperCase(),
          allowed_level_1_supervision_location_ids: "INVALID_DISRTRICT_ID",
        },
      });
      mockIsAuthenticated.mockResolvedValue(true);
      mockGetUser.mockResolvedValue({
        email_verified: true,
        ...metadata,
        email: userEmail,
      });

      userStore = new UserStore({
        authSettings: testAuthSettings,
        rootStore: new RootStore(),
      });

      await userStore.authorize();
      endpoint = `${tenantId}/restrictedAccess`;
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("sets the an authError", () => {
      expect(userStore.authError).toEqual(
        new Error(ERROR_MESSAGES.unauthorized)
      );
      expect(userStore.restrictedDistrict).toBe(undefined);
      expect(userStore.restrictedDistrictIsLoading).toBe(false);
    });
  });

  describe("when API responds with an error", () => {
    beforeEach(async () => {
      mockCallRestrictedAccessApi.mockRejectedValueOnce(new Error());

      mockIsAuthenticated.mockResolvedValue(true);
      userStore = new UserStore({
        authSettings: testAuthSettings,
        rootStore: new RootStore(),
      });

      await userStore.authorize();
      endpoint = `${tenantId}/restrictedAccess`;
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("does not set the restrictedDistrict", () => {
      expect(userStore.restrictedDistrict).toBeFalsy();
    });

    it("sets an authError and isLoading to false", () => {
      expect(userStore.authError).toEqual(
        new Error(ERROR_MESSAGES.unauthorized)
      );
      expect(userStore.restrictedDistrictIsLoading).toBe(false);
    });
  });
});
