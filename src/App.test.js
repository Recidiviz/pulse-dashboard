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
import UsMoCommunityRevocations from "./views/tenants/us_mo/community/Revocations";
import UsPaCommunityRevocations from "./views/tenants/us_pa/community/Revocations";
import UsNdCommunityGoals from "./views/tenants/us_nd/community/Goals";
import NotFound from "./views/NotFound";

jest.mock("./utils/intercomSettings");
jest.mock("./utils/initFontAwesome");
jest.mock("./views/tenants/utils/i18nSettings");
jest.mock("./views/tenants/us_mo/community/Revocations");
jest.mock("./views/tenants/us_pa/community/Revocations");
jest.mock("./views/tenants/us_nd/community/Goals");
jest.mock("./views/NotFound");
jest.mock("./react-auth0-spa");

describe("App tests", () => {
  UsMoCommunityRevocations.mockReturnValue(null);
  UsPaCommunityRevocations.mockReturnValue(null);
  UsNdCommunityGoals.mockReturnValue(null);
  NotFound.mockReturnValue(null);

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
    render(<App />);

    expect(UsMoCommunityRevocations).toHaveBeenCalled();
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
    render(<App />);

    expect(UsNdCommunityGoals).toHaveBeenCalled();
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
    render(<App />);

    expect(UsPaCommunityRevocations).toHaveBeenCalled();
  });

  it("should render Not Found page ", () => {
    window.history.pushState({}, "PA revocations page", "/some/page");
    render(<App />);

    expect(NotFound).toHaveBeenCalled();
  });
});
