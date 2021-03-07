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
import { useLocation } from "react-router-dom";

import PropTypes from "prop-types";
import TopBar from "../topbar/TopBar";
import TopBarDropdown from "../topbar/TopBarDropdown";
import TopBarUserMenuForAuthenticatedUser from "../topbar/TopBarUserMenuForAuthenticatedUser";
import CorePageSelector from "../topbar/CorePageSelector";
import Footer from "../Footer";

import "./CoreLayout.scss";

const selectOptions = {
  communiity: {
    value: "Community",
    label: "Community",
    defaultPath: "/community",
    pages: ["goals", "explore"],
  },
  facilities: {
    value: "Facilities",
    label: "Facilities",
    defaultPath: "/facilities",
    pages: ["goals", "explore"],
  },
  programming: {
    value: "Programming",
    label: "Programming",
    defaultPath: "/programming",
    pages: ["explore"],
  },
};

const CoreLayout = ({ children }) => {
  const { pathname } = useLocation();
  const [currentSection, currentPage] = pathname.split("/").slice(1, 3);
  const pageOptions = (
    selectOptions[currentSection] ?? selectOptions.facilities
  ).pages;

  return (
    <div id="app">
      <div className="page-container">
        <TopBar>
          <div className="CoreHeader">
            <ul className="nav-left">
              <TopBarDropdown />
            </ul>
            <ul className="nav-right">
              <CorePageSelector
                currentSection={currentSection}
                currentPage={currentPage}
                pageOptions={pageOptions}
              />
              <TopBarUserMenuForAuthenticatedUser />
            </ul>
          </div>
        </TopBar>
        {children}
      </div>
      <Footer />
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
