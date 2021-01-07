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

import React, { Suspense, lazy } from "react";
import {
  Redirect,
  Route,
  Switch,
  BrowserRouter as Router,
} from "react-router-dom";

import TenantRoutes from "./components/TenantRoutes";
import { PageProvider } from "./contexts/PageContext";
import NotFound from "./views/NotFound";
// import Profile from "./views/Profile";
import VerificationNeeded from "./views/VerificationNeeded";
import LanternLayout from "./components/layouts/LanternLayout";
import CoreLayout from "./components/layouts/CoreLayout";
// import Revocations from "./components/Revocations";
// import UsNdCommunityGoals from "./views/tenants/us_nd/community/Goals";
// import UsNdCommunityExplore from "./views/tenants/us_nd/community/Explore";
// import UsNdFacilitiesGoals from "./views/tenants/us_nd/facilities/Goals";
// import UsNdFacilitiesExplore from "./views/tenants/us_nd/facilities/Explore";
// import UsNdProgrammingExplore from "./views/tenants/us_nd/programming/Explore";
import initFontAwesome from "./utils/initFontAwesome";
import initIntercomSettings from "./utils/initIntercomSettings";
import { initI18n } from "./views/tenants/utils/i18nSettings";
import { LANTERN_TENANTS } from "./views/tenants/utils/lanternTenants";
import { CORE_TENANTS } from "./views/tenants/utils/coreTenants";
import StoreProvider from "./StoreProvider";
import Loading from "./components/Loading";

import "./assets/scripts/index";
import "./assets/styles/index.scss";

const Revocations = lazy(() => import("./components/Revocations"));
const UsNdCommunityGoals = lazy(() =>
  import("./views/tenants/us_nd/community/Goals")
);
const UsNdCommunityExplore = lazy(() =>
  import("./views/tenants/us_nd/community/Explore")
);
const UsNdFacilitiesGoals = lazy(() =>
  import("./views/tenants/us_nd/facilities/Goals")
);
const UsNdFacilitiesExplore = lazy(() =>
  import("./views/tenants/us_nd/facilities/Explore")
);
const UsNdProgrammingExplore = lazy(() =>
  import("./views/tenants/us_nd/programming/Explore")
);
const Profile = lazy(() => import("./views/Profile"));

initFontAwesome();
initIntercomSettings();
initI18n();

// prettier-ignore
const App = () => (
  <StoreProvider>
    <PageProvider>
      <Router>
        <Switch>
          <Route path="/verify" component={VerificationNeeded} />

          <TenantRoutes>
            <LanternLayout tenantIds={LANTERN_TENANTS}>
              <Switch>
                <Suspense fallback={<Loading />}>
                  <Route path="/community/revocations" component={Revocations} />
                  <Route path="/profile" component={Profile} />
                </Suspense>
                  <Redirect exact from="/" to="/community/revocations" />
                  <Redirect from="/revocations" to="/community/revocations" />
                  <NotFound />
              </Switch>
            </LanternLayout>

            <CoreLayout tenantIds={CORE_TENANTS}>
              <Switch>
                <Suspense fallback={<Loading />}>
                  <Route path="/community/goals" component={UsNdCommunityGoals} />
                  <Route path="/community/explore" component={UsNdCommunityExplore} />
                  <Route path="/facilities/goals" component={UsNdFacilitiesGoals} />
                  <Route path="/facilities/explore" component={UsNdFacilitiesExplore} />
                  <Route path="/programming/explore" component={UsNdProgrammingExplore} />
                  <Route path="/profile" component={Profile} />
                </Suspense>
                <Redirect exact from="/" to="/community/goals" />
                <Redirect from="/snapshots" to="/community/goals" />
                <Redirect from="/revocations" to="/community/goals" />
                <Redirect from="/reincarcerations" to="/facilities/goals" />
                <Redirect from="/programEvaluation/freeThroughRecovery" to="/programming/explore" />
                <NotFound />
              </Switch>
            </CoreLayout>
          </TenantRoutes>
        </Switch>
      </Router>
    </PageProvider>
  </StoreProvider>
);

export default App;
