import { renderHook, cleanup } from "@testing-library/react-hooks";
import createAuth0Client from "@auth0/auth0-spa-js";

import { Auth0Provider, useAuth0 } from "../react-auth0-spa";
import isDemoMode from "../utils/authentication/demoMode";
import { getDemoUser } from "../utils/authentication/viewAuthentication";

jest.mock("@auth0/auth0-spa-js");
jest.mock("../utils/authentication/demoMode");
describe("react auth0 tests", () => {
  const mockUser = { name: "some name" };

  const mockRedirectCallback = () => {};
  const mockHandleRedirectCallback = jest.fn();
  const mockGetIsAuthenticated = jest.fn();
  const mockGetUser = jest.fn().mockReturnValue(mockUser);
  isDemoMode.mockReturnValue(false);

  const mockAuth0Client = {
    handleRedirectCallback: mockHandleRedirectCallback,
    isAuthenticated: mockGetIsAuthenticated,
    getUser: mockGetUser,
  };

  createAuth0Client.mockResolvedValue(mockAuth0Client);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return user data if user is authenticated", async () => {
    mockGetIsAuthenticated.mockReturnValue(true);
    const { result, waitForNextUpdate } = renderHook(() => useAuth0(), {
      wrapper: Auth0Provider,
      initialProps: {
        onRedirectCallback: mockRedirectCallback,
      },
    });

    expect(result.current.isAuthenticated).toBeFalse();
    expect(result.current.loading).toBeTrue();
    expect(result.current.user).toBeNull();

    await waitForNextUpdate();

    expect(result.current.isAuthenticated).toBeTrue();
    expect(result.current.loading).toBeFalse();
    expect(result.current.user).toStrictEqual(mockUser);

    await cleanup();
  });

  it("should not return user data if user is not authenticated", async () => {
    mockGetIsAuthenticated.mockReturnValue(false);

    const { result, waitForNextUpdate } = renderHook(() => useAuth0(), {
      wrapper: Auth0Provider,
      initialProps: {
        onRedirectCallback: mockRedirectCallback,
      },
    });

    await waitForNextUpdate();

    expect(result.current.isAuthenticated).toBeFalse();
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBeFalse();

    await cleanup();
  });

  it("should be authenticated with demo user when demo mode is on", async () => {
    isDemoMode.mockReturnValue(true);

    const { result, waitForNextUpdate } = renderHook(() => useAuth0(), {
      wrapper: Auth0Provider,
      initialProps: {
        onRedirectCallback: mockRedirectCallback,
      },
    });

    const demoUser = getDemoUser();
    expect(result.current.isAuthenticated).toBeTrue();
    expect(result.current.user).toEqual(demoUser);

    await waitForNextUpdate();

    expect(result.current.isAuthenticated).toBeTrue();
    expect(result.current.user).toEqual(demoUser);
  });
});
