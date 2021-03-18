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
import { useLocation, Link } from "react-router-dom";
import CoreSectionSelector from "./CoreSectionSelector";
import CorePageSelector from "./CorePageSelector";
import TopBarUserMenuForAuthenticatedUser from "../components/TopBar/TopBarUserMenuForAuthenticatedUser";
import flags from "../flags";

import recidivizLogo from "../assets/static/images/Logo.svg";
import "./CoreNavigation.scss";

const navigationLayout = flags.showMethodologyDropdown
  ? {
      community: ["explore", "projections"],
      facilities: ["explore", "projections"],
      goals: [],
      methodology: [],
    }
  : {
      community: ["explore", "projections"],
      facilities: ["explore", "projections"],
      goals: [],
    };

const CoreNavigation: React.FC = () => {
  const { pathname } = useLocation();
  const [currentSection, currentPage] = pathname.split("/").slice(1, 3);
  // @ts-ignore
  const pageOptions = navigationLayout[currentSection] ?? [];

  const menu = Object.entries(navigationLayout).map((entry) => {
    const page = entry[0];
    const options = entry[1];
    return {
      label: page[0].toUpperCase() + page.slice(1),
      // @ts-ignore
      link: `/${page}${options.length ? `/${options[0]}` : ""}`,
    };
  });

  return (
    <nav className="CoreNavigation">
      <div className="CoreNavigation__left">
        <div className="CoreNavigation__logo">
          <Link to="/goals">
            <img
              className="CoreNavigation__logo-image"
              src={recidivizLogo}
              alt="Logo"
            />
          </Link>
        </div>
        <CoreSectionSelector menu={menu} />
      </div>
      <div className="CoreNavigation__right">
        {flags.enableCoreTabNavigation && (
          <CorePageSelector
            currentSection={currentSection}
            currentPage={currentPage ?? ""}
            pageOptions={pageOptions}
          />
        )}
        <TopBarUserMenuForAuthenticatedUser hideUsername />
      </div>
    </nav>
  );
};

export default CoreNavigation;
