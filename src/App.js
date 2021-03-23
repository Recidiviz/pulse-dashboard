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
import {
  Redirect,
  Route,
  Switch,
  BrowserRouter as Router,
} from "react-router-dom";
import * as Sentry from "@sentry/react";

import ProtectedRoute from "./ProtectedRoute";
import RedirectHome from "./RedirectHome";
import { PageProvider } from "./contexts/PageContext";
import StoreProvider from "./components/StoreProvider";
import NotFound from "./components/NotFound";
import Profile from "./components/Profile";
import Methodology from "./core/methodology/Methodology";
import VerificationNeeded from "./components/VerificationNeeded";
import LanternLayout from "./lantern/LanternLayout";
import CoreLayout from "./core/CoreLayout";
import Revocations from "./lantern/Revocations";
import UsNdCommunityExplore from "./core/community/Explore";
import UsNdFacilitiesExplore from "./core/facilities/Explore";
import PageProjections from "./core/PageProjections";
import CoreGoalsView from "./core/goals/CoreGoalsView";
import initFontAwesome from "./utils/initFontAwesome";
import initIntercomSettings from "./utils/initIntercomSettings";
import { initI18n } from "./utils/i18nSettings";
import { LANTERN_TENANTS } from "./RootStore/TenantStore/lanternTenants";
import { CORE_TENANTS } from "./RootStore/TenantStore/coreTenants";
import { CORE_PATHS } from "./core/views";
import AuthWall from "./AuthWall";
import ErrorBoundary from "./components/ErrorBoundary";

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
                  <Route path="/community/revocations" component={Revocations} />
                  <Route path="/profile" component={Profile} />
                  <Redirect exact from="/" to="/community/revocations" />
                  <Redirect from="/revocations" to="/community/revocations" />
                  <NotFound />
                </Switch>
              </LanternLayout>

              <CoreLayout tenantIds={CORE_TENANTS}>
                <Switch>
                  <ProtectedRoute path={CORE_PATHS.goals} component={CoreGoalsView} />
                  <ProtectedRoute path={CORE_PATHS.communityExplore} component={UsNdCommunityExplore} />
                  <ProtectedRoute path={CORE_PATHS.communityProjections} component={PageProjections} />
                  <ProtectedRoute path={CORE_PATHS.facilitiesExplore} component={UsNdFacilitiesExplore} />
                  <ProtectedRoute path={CORE_PATHS.facilitiesProjections} component={PageProjections} />
                  <ProtectedRoute path={CORE_PATHS.methodology} component={Methodology} />
                  <Route path="/profile" component={Profile} />
                  <RedirectHome />
                  <Redirect from="/snapshots" to="/goals" />
                  <Redirect from="/revocations" to="/goals" />
                  <Redirect from="/reincarcerations" to="/goals" />
                  <Redirect from="/community/goals" to="/goals" />
                  <Redirect from="/facilities/goals" to="/goals" />
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
