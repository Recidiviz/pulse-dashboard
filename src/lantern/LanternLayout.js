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
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { observer } from "mobx-react-lite";

import TopBar from "../components/TopBar/TopBar";
import TopBarLogo from "../components/TopBar/TopBarLogo";
import TopBarUserMenuForAuthenticatedUser from "../components/TopBar/TopBarUserMenuForAuthenticatedUser";
import Footer from "../components/Footer";
import usePageLayout from "./hooks/usePageLayout";
import useIntercom from "../hooks/useIntercom";
import { setTranslateLocale } from "../utils/i18nSettings";
import { useRootStore } from "../components/StoreProvider";

import "./LanternLayout.scss";

const LanternLayout = ({ children }) => {
  const { currentTenantId } = useRootStore();
  useIntercom();
  usePageLayout();
  setTranslateLocale(currentTenantId);

  return (
    <div className="LanternLayout" id="app">
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <div className="wide-page-container">
        <TopBar isHidable isWide>
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
};

export default observer(LanternLayout);
