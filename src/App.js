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
import {
  Redirect,
  Route,
  Switch,
  BrowserRouter as Router,
} from "react-router-dom";
import * as Sentry from "@sentry/react";

import { PageProvider } from "./contexts/PageContext";
import StoreProvider from "./components/StoreProvider";
import NotFound from "./components/NotFound";
import Profile from "./components/Profile";
import VerificationNeeded from "./components/VerificationNeeded";
import LanternLayout from "./lantern/LanternLayout";
import CoreLayout from "./core/CoreLayout";
import Revocations from "./lantern/Revocations";
import UsNdCommunityGoals from "./core/community/Goals";
import UsNdCommunityExplore from "./core/community/Explore";
import UsNdFacilitiesGoals from "./core/facilities/Goals";
import UsNdFacilitiesExplore from "./core/facilities/Explore";
import UsNdProgrammingExplore from "./core/programming/Explore";
import PageProjections from "./core/PageProjections";
import initFontAwesome from "./utils/initFontAwesome";
import initIntercomSettings from "./utils/initIntercomSettings";
import { initI18n } from "./utils/i18nSettings";
import { LANTERN_TENANTS } from "./RootStore/TenantStore/lanternTenants";
import { CORE_TENANTS } from "./RootStore/TenantStore/coreTenants";
import AuthWall from "./AuthWall";
import ErrorBoundary from "./components/ErrorBoundary";
import { CoreLoading } from "./components/CoreLoadingIndicator";
import PageTemplate from "./core/PageTemplate";

import "./assets/scripts/index";
import "./assets/styles/index.scss";

initFontAwesome();
initIntercomSettings();
initI18n();

Sentry.init({
  environment: process.env.REACT_APP_SENTRY_ENV,
  dsn: process.env.REACT_APP_SENTRY_DSN,
});

// prettier-ignore
const App = () => (
  <StoreProvider>
    <ErrorBoundary>
      <PageProvider>
        <Router>
          <Switch>
            <Route path="/verify" component={VerificationNeeded} />
            <AuthWall>
              <LanternLayout tenantIds={LANTERN_TENANTS}>
                <Switch>
                  <Route
                    path="/community/revocations"
                    component={Revocations}
                  />
                  <Route path="/profile" component={Profile} />
                  <Redirect exact from="/" to="/community/revocations" />
                  <Redirect from="/revocations" to="/community/revocations" />
                  <NotFound />
                </Switch>
              </LanternLayout>

                <CoreLayout tenantIds={CORE_TENANTS}>
                  <Switch>
                    <Route path="/community/goals" component={UsNdCommunityGoals} />
                    <Route path="/community/explore" component={UsNdCommunityExplore} />
                    <Route path="/facilities/goals" component={UsNdFacilitiesGoals} />
                    <Route path="/facilities/explore" component={UsNdFacilitiesExplore} />
                    <Route path="/facilities/projections" component={PageProjections} />
                    <Route path="/programming/explore" component={UsNdProgrammingExplore} />
                    <Route path="/profile" component={Profile} />
                    <Redirect exact from="/" to="/community/goals" />
                    <Redirect from="/snapshots" to="/community/goals" />
                    <Redirect from="/revocations" to="/community/goals" />
                    <Redirect from="/reincarcerations" to="/facilities/goals" />
                    <Redirect from="/programEvaluation/freeThroughRecovery" to="/programming/explore" />
                    <NotFound />
                  </Switch>
                </CoreLayout>
              </AuthWall>
            </Switch>
          </Router>
        </PageProvider>
    </ErrorBoundary>
  </StoreProvider>
);

export default App;
