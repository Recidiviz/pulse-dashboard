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

import React from "react";
import { useLocation } from "react-router-dom";
import CoreSectionSelector from "./CoreSectionSelector";
import CorePageSelector from "./CorePageSelector";
import TopBarUserMenuForAuthenticatedUser from "../components/TopBar/TopBarUserMenuForAuthenticatedUser";

import recidivizLogo from "../assets/static/images/Logo.svg";
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
    // @ts-ignore
    navigationLayout[currentSection] ?? navigationLayout.facilities;
  return (
    <nav className="CoreNavigation">
      <div className="CoreNavigation__left">
        <div className="CoreNavigation__logo">
          <img
            className="CoreNavigation__logo-image"
            src={recidivizLogo}
            alt="Logo"
          />
        </div>
        <CoreSectionSelector />
      </div>
      <div className="CoreNavigation__right">
        <CorePageSelector
          currentSection={currentSection}
          currentPage={currentPage ?? ""}
          pageOptions={pageOptions}
        />
        <TopBarUserMenuForAuthenticatedUser hideUsername />
      </div>
    </nav>
  );
};

export default CoreNavigation;
