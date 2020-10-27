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

import App from "./App";
import { useAuth0 } from "./react-auth0-spa";
import { ND } from "./views/tenants/utils/coreTenants";
import { MO, PA } from "./views/tenants/utils/lanternTenants";

import mockWithTestId from "../__helpers__/mockWithTestId";
import UsMoRevocations from "./views/tenants/us_mo/community/Revocations";
import UsPaRevocations from "./views/tenants/us_pa/community/Revocations";
import UsNDCommunityGoals from "./views/tenants/us_nd/community/Goals";
import NotFound from "./views/NotFound";
import Loading from "./components/Loading";

jest.mock("./utils/intercomSettings");
jest.mock("./utils/initFontAwesome");
jest.mock("./views/tenants/utils/i18nSettings");
jest.mock("./views/tenants/us_mo/community/Revocations");
jest.mock("./views/tenants/us_pa/community/Revocations");
jest.mock("./views/tenants/us_nd/community/Goals");
jest.mock("./views/NotFound");
jest.mock("./components/Loading");
jest.mock("./react-auth0-spa");

describe("App tests", () => {
  const mockMOCommunityRevocationsId = "mo-community-revocations-id";
  const mockPACommunityRevocationsId = "pa-community-revocations-id";
  const mockNDCommunityGoalsId = "nd-community-goals-id";
  const mockNotFoundId = "not-found-id";
  const mockLoadingTestId = "loading-test-id";
  UsMoRevocations.mockReturnValue(mockWithTestId(mockMOCommunityRevocationsId));
  UsPaRevocations.mockReturnValue(mockWithTestId(mockPACommunityRevocationsId));
  UsNDCommunityGoals.mockReturnValue(mockWithTestId(mockNDCommunityGoalsId));
  NotFound.mockReturnValue(mockWithTestId(mockNotFoundId));
  Loading.mockReturnValue(mockWithTestId(mockLoadingTestId));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render MO revocations page", () => {
    window.history.pushState(
      {},
      "MO revocations page",
      "/community/revocations"
    );
    const user = {
      "https://dashboard.recidiviz.org/app_metadata": {
        state_code: MO,
      },
    };
    useAuth0.mockReturnValue({
      user,
      isAuthenticated: true,
      loading: false,
      loginWithRedirect: jest.fn(),
      getTokenSilently: jest.fn(),
    });
    const { getByTestId } = render(<App />);

    expect(getByTestId(mockMOCommunityRevocationsId)).toBeInTheDocument();
  });

  it("should render ND community goals page", () => {
    window.history.pushState({}, "ND community goals page", "/community/goals");
    const user = {
      "https://dashboard.recidiviz.org/app_metadata": {
        state_code: ND,
      },
    };
    useAuth0.mockReturnValue({
      user,
      isAuthenticated: true,
      loading: false,
      loginWithRedirect: jest.fn(),
      getTokenSilently: jest.fn(),
    });
    const { getByTestId } = render(<App />);

    expect(getByTestId(mockNDCommunityGoalsId)).toBeInTheDocument();
  });

  it("should render PA community goals page", () => {
    window.history.pushState(
      {},
      "PA revocations page",
      "/community/revocations"
    );
    const user = {
      "https://dashboard.recidiviz.org/app_metadata": {
        state_code: PA,
      },
    };
    useAuth0.mockReturnValue({
      user,
      isAuthenticated: true,
      loading: false,
      loginWithRedirect: jest.fn(),
      getTokenSilently: jest.fn(),
    });
    const { getByTestId } = render(<App />);

    expect(getByTestId(mockPACommunityRevocationsId)).toBeInTheDocument();
  });

  it("should render Not Found page ", () => {
    window.history.pushState({}, "PA revocations page", "/some/page");
    const { getByTestId } = render(<App />);

    expect(getByTestId(mockNotFoundId)).toBeInTheDocument();
  });

  it("should render Loading component while user is loading", () => {
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      loading: true,
      loginWithRedirect: jest.fn(),
      getTokenSilently: jest.fn(),
    });

    const { container } = render(<App />);

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

    render(<App />);

    expect(loginWithRedirect).toHaveBeenCalled();
  });
});
