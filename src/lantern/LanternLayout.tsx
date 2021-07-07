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
import { Helmet } from "react-helmet";
import { observer } from "mobx-react-lite";

import Footer from "../components/Footer";
import usePageLayout from "./hooks/usePageLayout";
import useIntercom from "../hooks/useIntercom";
import { setTranslateLocale } from "../utils/i18nSettings";
import { useRootStore } from "../components/StoreProvider";
import LanternStoreProvider from "./LanternStoreProvider";
import LanternErrorBoundary from "./ErrorBoundary";
import LanternTopBar from "./LanternTopBar";
import IE11Banner from "../components/IE11Banner";

import "./LanternLayout.scss";

interface Props {
  children: React.ReactElement;
}

const LanternLayout: React.FC<Props> = ({ children }): React.ReactElement => {
  const { currentTenantId, pageStore } = useRootStore();
  useIntercom();
  usePageLayout(pageStore.hideTopBar);
  setTranslateLocale(currentTenantId);

  return (
    <LanternStoreProvider>
      <LanternErrorBoundary>
        <div className="LanternLayout" id="app">
          <Helmet>
            <link
              href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;500;600;700&display=swap"
              rel="stylesheet"
            />
          </Helmet>
          <div className="wide-page-container">
            <LanternTopBar />
            <IE11Banner lantern />
            {children}
            <Footer />
          </div>
        </div>
      </LanternErrorBoundary>
    </LanternStoreProvider>
  );
};

export default observer(LanternLayout);
