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

import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

import TopBarHamburgerMenu from "./TopBarHamburgerMenu";
import TopBarLayout from "./TopBarLayout";
import TopBarLogo from "./TopBarLogo";
import TopBarTitle from "./TopBarTitle";
import TopBarUserMenuForGuest from "./TopBarUserMenuForGuest";
import TopBarUserMenuForAuthenticatedUser from "./TopBarUserMenuForAuthenticatedUser";

import useLayout from "../../hooks/useLayout";
import { useAuth0 } from "../../react-auth0-spa";

import "./topbar.scss";

const TopBar = ({ toggleSideBar }) => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const location = useLocation();
  const { isLantern, isWide } = useLayout();

  const onLogin = useCallback(
    () => loginWithRedirect({ appState: { targetUrl: "/community/goals" } }),
    [loginWithRedirect]
  );

  const onLogout = useCallback(
    () => logout({ returnTo: window.location.origin }),
    [logout]
  );

  return (
    <TopBarLayout isWide={isWide}>
      {isLantern ? (
        <TopBarLogo />
      ) : (
        <ul className="nav-left">
          {isAuthenticated && <TopBarHamburgerMenu onClick={toggleSideBar} />}
          <TopBarTitle pathname={location.pathname} />
        </ul>
      )}
      <ul className="nav-right">
        {isAuthenticated ? (
          <TopBarUserMenuForAuthenticatedUser user={user} onLogout={onLogout} />
        ) : (
          <TopBarUserMenuForGuest onLogin={onLogin} />
        )}
      </ul>
    </TopBarLayout>
  );
};

TopBar.propTypes = {
  toggleSideBar: PropTypes.func.isRequired,
};

export default TopBar;
