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
import { LANTERN_TENANTS } from "../../views/tenants/utils/lanternTenants";
import tenants from "../../tenants";

jest.mock("@auth0/auth0-spa-js");

const metadataField = `${METADATA_NAMESPACE}app_metadata`;
const metadata = { [metadataField]: { state_code: "US_MO" } };

const mockCreateAuth0Client = createAuth0Client as jest.Mock;
const mockGetUser = jest.fn();
const mockHandleRedirectCallback = jest.fn();
const mockIsAuthenticated = jest.fn();
const mockLoginWithRedirect = jest.fn();

const testAuthSettings = {
  domain: "example.com",
  client_id: "abc123",
  redirect_url: window.location.href,
};

beforeEach(() => {
  mockGetUser.mockResolvedValue(metadata);
  mockCreateAuth0Client.mockResolvedValue({
    getUser: mockGetUser,
    handleRedirectCallback: mockHandleRedirectCallback,
    isAuthenticated: mockIsAuthenticated,
    loginWithRedirect: mockLoginWithRedirect,
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

test("authorization immediately pending", async () => {
  const store = new UserStore({});
  reactImmediately(() => {
    expect(store.isAuthorized).toBe(false);
    expect(store.isLoading).toBe(true);
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
    expect(store.isLoading).toBe(false);
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
    expect(store.awaitingVerification).toBe(true);
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

test("passes target URL to callback", async () => {
  const targetUrl = "http://localhost/somePage?id=1";
  mockHandleRedirectCallback.mockResolvedValue({ appState: { targetUrl } });

  const auth0LoginParams = "code=123456&state=abcdef";
  const urlWithToken = new URL(window.location.href);
  urlWithToken.search = `?${auth0LoginParams}`;
  window.history.pushState({}, "Test", urlWithToken.href);

  const store = new UserStore({
    authSettings: testAuthSettings,
  });

  const callback = jest.fn();

  await store.authorize({ handleTargetUrl: callback });
  expect(callback.mock.calls[0][0]).toBe(targetUrl);
});

test.each(Object.keys(tenants))(
  "gets metadata for the user %s",
  async (tenantId) => {
    const tenantMetadata = { [metadataField]: { state_code: tenantId } };
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
        tenants[tenantId].availableStateCodes
      );
      expect(store.stateName).toBe(
        // TODO TS remove when tenants is ported to TS
        // @ts-ignore
        tenants[tenantId].name
      );
    });
    expect.hasAssertions();
  }
);
