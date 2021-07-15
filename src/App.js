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

import "./assets/scripts/index";
import "./assets/styles/index.scss";

import * as Sentry from "@sentry/react";
import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import AuthWall from "./AuthWall";
import NotFound from "./components/NotFound";
import Profile from "./components/Profile";
import SentryErrorBoundary from "./components/SentryErrorBoundary";
import StoreProvider from "./components/StoreProvider";
import VerificationNeeded from "./components/VerificationNeeded";
import UsNdCommunityExplore from "./core/community/Explore";
import CoreLayout from "./core/CoreLayout";
import UsNdFacilitiesExplore from "./core/facilities/Explore";
import CoreGoalsView from "./core/goals/CoreGoalsView";
import PageMethodology from "./core/PageMethodology";
import PageProjections from "./core/PageProjections";
import PageVitals from "./core/PageVitals";
import { CORE_PATHS } from "./core/views";
import LanternLayout from "./lantern/LanternLayout";
import Revocations from "./lantern/Revocations";
import ProtectedRoute from "./ProtectedRoute";
import RedirectHome from "./RedirectHome";
import { CORE_TENANTS } from "./RootStore/TenantStore/coreTenants";
import { LANTERN_TENANTS } from "./RootStore/TenantStore/lanternTenants";
import { initI18n } from "./utils/i18nSettings";
import initFontAwesome from "./utils/initFontAwesome";
import initIntercomSettings from "./utils/initIntercomSettings";

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
    <SentryErrorBoundary>
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
                <ProtectedRoute path={CORE_PATHS.communityVitals} component={PageVitals}/>
                <ProtectedRoute path={CORE_PATHS.methodology} component={PageMethodology} />
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
    </SentryErrorBoundary>
  </StoreProvider>
);

export default App;
