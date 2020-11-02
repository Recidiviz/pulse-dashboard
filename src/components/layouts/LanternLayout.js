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

import TopBar from "../topbar/TopBar";
import TopBarLogo from "../topbar/TopBarLogo";
import TopBarUserMenuForAuthenticatedUser from "../topbar/TopBarUserMenuForAuthenticatedUser";
import Footer from "../Footer";
import usePageLayout from "../../hooks/usePageLayout";
import useIntercom from "../../hooks/useIntercom";
import { setTranslateLocale } from "../../views/tenants/utils/i18nSettings";

const LanternLayout = ({ stateCode, children }) => {
  useIntercom();
  usePageLayout();
  setTranslateLocale(stateCode);

  return (
    <div id="app">
      <div className="wide-page-container">
        <TopBar isWide>
          <TopBarLogo />
          <ul className="nav-right">
            <TopBarUserMenuForAuthenticatedUser />
          </ul>
        </TopBar>
        {children}
        <Footer />
      </div>
    </div>
  );
};

LanternLayout.propTypes = {
  children: PropTypes.node.isRequired,
  stateCode: PropTypes.string.isRequired,
};

export default LanternLayout;
