// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2019 Recidiviz, Inc.
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

import React from "react";
import { render } from "@testing-library/react";

import App from "../App";
import { useAuth0 } from "../react-auth0-spa";
import { METADATA_NAMESPACE } from "../utils/authentication/user";
import { US_ND } from "../views/tenants/utils/coreTenants";
import { US_MO, US_PA } from "../views/tenants/utils/lanternTenants";

import mockWithTestId from "../../__helpers__/mockWithTestId";
import Revocations from "../components/Revocations";
import UsNDCommunityGoals from "../views/tenants/us_nd/community/Goals";
import NotFound from "../views/NotFound";
import Loading from "../components/Loading";
import LanternLayout from "../components/layouts/LanternLayout";
import CoreLayout from "../components/layouts/CoreLayout";
import StoreProvider, { useRootStore } from "../StoreProvider";

jest.mock("../utils/initIntercomSettings");
jest.mock("../utils/initFontAwesome");
jest.mock("../views/tenants/utils/i18nSettings");
jest.mock("../components/layouts/LanternLayout");
jest.mock("../components/layouts/CoreLayout");
jest.mock("../components/Revocations");
jest.mock("../views/tenants/us_nd/community/Goals");
jest.mock("../views/NotFound");
jest.mock("../components/Loading");
jest.mock("../react-auth0-spa");
jest.mock("../StoreProvider");

describe("App tests", () => {
  const metadataField = `${METADATA_NAMESPACE}app_metadata`;

  const mockRevocationsId = "mo-community-revocations-id";
  const mockNDCommunityGoalsId = "nd-community-goals-id";
  const mockNotFoundId = "not-found-id";
  const mockLoadingTestId = "loading-test-id";

  const LanternLayoutMock = LanternLayout.type;
  const RevocationsMock = Revocations.type;

  LanternLayoutMock.mockImplementation(({ children }) => children);
  CoreLayout.mockImplementation(({ children }) => children);
  StoreProvider.mockImplementation(({ children }) => children);
  RevocationsMock.mockReturnValue(mockWithTestId(mockRevocationsId));
  UsNDCommunityGoals.mockReturnValue(mockWithTestId(mockNDCommunityGoalsId));
  NotFound.mockReturnValue(mockWithTestId(mockNotFoundId));
  Loading.mockReturnValue(mockWithTestId(mockLoadingTestId));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render MO Layout with Revocations page", () => {
    window.history.pushState({}, "", "/community/revocations");
    const user = { [metadataField]: { state_code: US_MO } };
    useAuth0.mockReturnValue({
      user,
      isAuthenticated: true,
      loading: false,
      loginWithRedirect: jest.fn(),
      getTokenSilently: jest.fn(),
    });
    useRootStore.mockReturnValue({
      currentTenantId: US_MO,
    });

    const { getByTestId } = render(
      <StoreProvider>
        <App />
      </StoreProvider>
    );

    expect(LanternLayoutMock).toHaveBeenCalledTimes(1);
    expect(getByTestId(mockRevocationsId)).toBeInTheDocument();
  });

  it("should render ND Layout with community goals page", () => {
    window.history.pushState({}, "", "/community/goals");
    const user = { [metadataField]: { state_code: US_ND } };

    useAuth0.mockReturnValue({
      user,
      isAuthenticated: true,
      loading: false,
      loginWithRedirect: jest.fn(),
      getTokenSilently: jest.fn(),
    });
    useRootStore.mockReturnValue({
      currentTenantId: US_ND,
    });

    const { getByTestId } = render(
      <StoreProvider>
        <App />
      </StoreProvider>
    );

    expect(CoreLayout).toHaveBeenCalledTimes(1);
    expect(getByTestId(mockNDCommunityGoalsId)).toBeInTheDocument();
  });

  it("should render PA Layout with Revocations page", () => {
    window.history.pushState({}, "", "/community/revocations");
    const user = { [metadataField]: { state_code: US_PA } };
    useAuth0.mockReturnValue({
      user,
      isAuthenticated: true,
      loading: false,
      loginWithRedirect: jest.fn(),
      getTokenSilently: jest.fn(),
    });
    useRootStore.mockReturnValue({
      currentTenantId: US_PA,
    });

    const { getByTestId } = render(<App />);

    expect(LanternLayoutMock).toHaveBeenCalledTimes(1);
    expect(getByTestId(mockRevocationsId)).toBeInTheDocument();
  });

  it("should render Not Found page ", () => {
    window.history.pushState({}, "", "/some/page");
    const { container, getByTestId } = render(
      <StoreProvider>
        <App />
      </StoreProvider>
    );

    expect(container.children.length).toBe(1);
    expect(getByTestId(mockNotFoundId)).toBeInTheDocument();
  });

  it("should render Loading component while user is loading", () => {
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      loading: true,
      loginWithRedirect: jest.fn(),
      getTokenSilently: jest.fn(),
    });

    const { container } = render(
      <StoreProvider>
        <App />
      </StoreProvider>
    );

    expect(container.children.length).toBe(1);
    expect(container.firstChild.dataset.testid).toBe(mockLoadingTestId);
  });

  it("should redirect to login page is user is not authenticated", () => {
    const loginWithRedirect = jest.fn();
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      loading: false,
      loginWithRedirect,
      getTokenSilently: jest.fn(),
    });

    render(
      <StoreProvider defaultTenantId="US_PA">
        <App />
      </StoreProvider>
    );

    expect(loginWithRedirect).toHaveBeenCalled();
  });
});
