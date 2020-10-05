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
import { useLocation } from "react-router-dom";

import SideBarHeader from "../../../components/sidebar/SideBarHeader";
import SideBarMenu from "../../../components/sidebar/SideBarMenu";
import SideBarGroup from "../../../components/sidebar/SideBarGroup";
import SideBarLink from "../../../components/sidebar/SideBarLink";
import SideBarFeedback from "../../../components/sidebar/SideBarFeedback";
import TopBarLayout from "../../../components/topbar/TopBarLayout";
import TopBarHamburgerMenu from "../../../components/topbar/TopBarHamburgerMenu";
import TopBarTitle from "../../../components/topbar/TopBarTitle";
import TopBarUserMenuForAuthenticatedUser from "../../../components/topbar/TopBarUserMenuForAuthenticatedUser";
import Footer from "../../../components/Footer";
import useSideBar from "../../../hooks/useSideBar";
import { disableIntercomLauncher } from "../../../utils/intercomSettings";

const Layout = ({ children }) => {
  disableIntercomLauncher();

  const { isSideBarCollapsed, toggleSideBar } = useSideBar();
  const location = useLocation();

  return (
    <div id="app" className={isSideBarCollapsed ? "is-collapsed" : ""}>
      <div className="sidebar">
        <div className="sidebar-inner">
          <SideBarHeader toggleSideBar={toggleSideBar} />
          <SideBarMenu>
            <SideBarGroup
              key="Community"
              name="Community"
              url="/community"
              icon={<i className="c-blue-500 ti-dashboard" />}
            >
              <SideBarLink name="Goals" url="/community/goals" />
              <SideBarLink name="Explore" url="/community/explore" />
            </SideBarGroup>
            <SideBarGroup
              key="Facilities"
              name="Facilities"
              url="/facilities"
              icon={<i className="c-red-500 ti-reload" />}
            >
              <SideBarLink name="Goals" url="/facilities/goals" />
              <SideBarLink name="Explore" url="/facilities/explore" />
            </SideBarGroup>
            <SideBarGroup
              key="Programming"
              name="Programming"
              url="/programming"
              icon={<i className="c-green-500 ti-location-arrow" />}
            >
              <SideBarLink name="Explore" url="/programming/explore" />
            </SideBarGroup>
            <SideBarFeedback />
          </SideBarMenu>
        </div>
      </div>

      <div className="page-container">
        <TopBarLayout>
          <ul className="nav-left">
            <TopBarHamburgerMenu onClick={toggleSideBar} />
            <TopBarTitle pathname={location.pathname} />
          </ul>
          <ul className="nav-right">
            <TopBarUserMenuForAuthenticatedUser />
          </ul>
        </TopBarLayout>

        {children}

        <Footer />
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};

export default Layout;
