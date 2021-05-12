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
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import UserStore from "../UserStore";
import TENANTS from "../../tenants";
import { TenantId } from "../types";

jest.mock("@auth0/auth0-spa-js");

const METADATA_NAMESPACE = process.env.REACT_APP_METADATA_NAMESPACE;

const mockCreateAuth0Client = createAuth0Client as jest.Mock;
const mockGetUser = jest.fn();
const mockHandleRedirectCallback = jest.fn();
const mockIsAuthenticated = jest.fn();
const mockLoginWithRedirect = jest.fn();
const mockGetTokenSilently = jest.fn();

const tenantId = "US_MO";
const metadataField = `${METADATA_NAMESPACE}app_metadata`;
const metadata = { [metadataField]: { state_code: tenantId } };
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
    getTokenSilently: mockGetTokenSilently,
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

test("authorization immediately pending", () => {
  const store = new UserStore({});
  expect(store.isAuthorized).toBe(false);
  expect(store.userIsLoading).toBe(true);
});

test("authorize requires Auth0 client settings", async () => {
  const store = new UserStore({});
  await store.authorize();
  const error = store.authError;
  expect(error?.message).toMatch(ERROR_MESSAGES.auth0Configuration);
});

test("error thrown in authorize sets authError", async () => {
  mockCreateAuth0Client.mockResolvedValue("INALID_AUTH_OBJECT");
  const store = new UserStore({
    authSettings: testAuthSettings,
  });
  await store.authorize();
  const error = store.authError;
  expect(error?.message).toBeDefined();
});

test("Invalid state thrown in authorize redirects to login", async () => {
  mockHandleRedirectCallback.mockResolvedValue(new Error("Invalid state"));
  expect(mockLoginWithRedirect.mock.calls.length).toBe(0);

  const store = new UserStore({
    authSettings: testAuthSettings,
  });
  await store.authorize();

  expect(mockLoginWithRedirect.mock.calls.length).toBe(1);
  expect(mockLoginWithRedirect.mock.calls[0][0]).toEqual({
    appState: { targetUrl: window.location.href },
  });
  expect(store.authError).toBe(undefined);
});

test("authorized when authenticated", async () => {
  mockIsAuthenticated.mockResolvedValue(true);
  mockGetUser.mockResolvedValue({ email_verified: true, ...metadata });

  const store = new UserStore({
    authSettings: testAuthSettings,
  });
  await store.authorize();
  expect(store.isAuthorized).toBe(true);
  expect(store.userIsLoading).toBe(false);
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
  expect(store.isAuthorized).toBe(false);
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
    expect(store.availableStateCodes).toBe(
      TENANTS[currentTenantId as TenantId].availableStateCodes
    );
    expect(store.stateName).toBe(TENANTS[currentTenantId as TenantId].name);
  }
);

test("Error from getTokenSilently redirects to login", async () => {
  expect(mockLoginWithRedirect.mock.calls.length).toBe(0);
  const store = new UserStore({
    authSettings: testAuthSettings,
  });
  await store.authorize();
  mockGetTokenSilently.mockResolvedValue(new Error("Login required"));
  await store.getTokenSilently();
  expect(mockLoginWithRedirect.mock.calls.length).toBe(1);
  expect(mockLoginWithRedirect.mock.calls[0][0]).toEqual({
    appState: { targetUrl: window.location.href },
  });
  expect(store.authError).toBe(undefined);
});
