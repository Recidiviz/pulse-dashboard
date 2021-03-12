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
import CoreSectionSelector from "./CoreSectionSelector";
import CorePageSelector from "./CorePageSelector";
import TopBarUserMenuForAuthenticatedUser from "../components/TopBar/TopBarUserMenuForAuthenticatedUser";

import "./CoreNavigation.scss";

const navigationLayout = {
  community: ["goals", "explore"],
  facilities: ["goals", "explore"],
  programming: ["explore"],
  methodology: ["vitals", "projections", "explore"],
};

const CoreNavigation = () => {
  const { pathname } = useLocation();
  const [currentSection, currentPage] = pathname.split("/").slice(1, 3);
  const pageOptions =
    navigationLayout[currentSection] ?? navigationLayout.facilities;
  return (
    <div className="CoreNavigation">
      <ul className="nav-left">
        <CoreSectionSelector />
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
  );
};

export default CoreNavigation;
