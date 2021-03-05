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

import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { useLocation, matchPath } from "react-router-dom";
import TopBar from "../topbar/TopBar";
import TopBarHamburgerMenu from "../topbar/TopBarHamburgerMenu";
import TopBarTitle from "../topbar/TopBarTitle";
import TopBarUserMenuForAuthenticatedUser from "../topbar/TopBarUserMenuForAuthenticatedUser";
import Footer from "../Footer";
import useSideBar from "../../hooks/useSideBar";

import "./CoreLayout.scss";

const CoreLayout = ({ children }) => {
  const { isSideBarCollapsed, toggleSideBar } = useSideBar();
  const { pathname } = useLocation();
  const onProfilePage = !!matchPath(pathname, {
    path: "/profile",
    exact: true,
  });
  const classNames = cn({
    "is-collapsed": isSideBarCollapsed,
    "is-hidden": onProfilePage,
  });

  return (
    <div id="app" className={classNames}>
      <div className="page-container">
        <TopBar>
          <div className="CoreHeader">
            <ul className="nav-left">
              <TopBarHamburgerMenu onClick={toggleSideBar} />
              <TopBarTitle pathname={pathname} />
            </ul>
            <ul className="nav-right">
              <TopBarUserMenuForAuthenticatedUser />
            </ul>
          </div>
        </TopBar>
        {children}

        <Footer />
      </div>
    </div>
  );
};

CoreLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};

export default CoreLayout;
