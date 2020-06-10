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
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import { useAuth0 } from "./react-auth0-spa";

import Footer from "./components/Footer";
import Loading from "./components/Loading";
import PrivateRoute from "./components/PrivateRoute";
import PrivateTenantRedirect from "./components/PrivateTenantRedirect";
import PrivateTenantRoute from "./components/PrivateTenantRoute";
import SideBar from "./components/sidebar/SideBar";
import TopBar from "./components/topbar/TopBar";
import useLayout from "./hooks/useLayout";
import useSideBar from "./hooks/useSideBar";
import { getUserStateCode } from "./utils/authentication/user";
import { isViewAvailableForUserState } from "./utils/authentication/viewAuthentication";
import NotFound from "./views/NotFound";
import Profile from "./views/Profile";
import VerificationNeeded from "./views/VerificationNeeded";
import { getLandingViewForState } from "./views/stateViews";
import "./assets/scripts/index";

// styles
import "./assets/styles/index.scss";

// fontawesome
import initFontAwesome from "./utils/initFontAwesome";

initFontAwesome();

const App = () => {
  const { user, loading, isAuthenticated } = useAuth0();
  const { isWide } = useLayout();
  const { isSideBarCollapsed, toggleSideBar } = useSideBar();

  if (loading) {
    return <Loading />;
  }

  // This lets us retrieve the state code for the user only after we have authenticated
  const getLandingView = (authenticated) => {
    if (!authenticated) {
      // This has to be a path that will lead to a page for every state and is taking advantage
      // of the fact that prior to a navigation refactor, this was a path used in all states, and
      // now happens to redirect to the right landing page for all current states.
      // TODO: But this will not be true for all states in the future, and will need a refactor.
      return "/revocations";
    }

    const stateCode = getUserStateCode(user);
    return getLandingViewForState(stateCode);
  };

  const containerClass = isWide ? "wide-page-container" : "page-container";

  const isUrlEnabled = (url) => isViewAvailableForUserState(user, url);

  return (
    <Router>
      <div id="app" className={isSideBarCollapsed ? "is-collapsed" : ""}>
        <div>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <title>Recidiviz Dashboard</title>
          <div>
            {!isWide && (
              <SideBar
                isUrlEnabled={isUrlEnabled}
                toggleSideBar={toggleSideBar}
              />
            )}
            <div className={containerClass}>
              <TopBar toggleSideBar={toggleSideBar} />

              <Switch>
                <Redirect exact from="/" to={getLandingView(isAuthenticated)} />

                <PrivateTenantRedirect from="/snapshots" />
                <PrivateTenantRedirect from="/revocations" />
                <PrivateTenantRedirect from="/reincarcerations" />
                <PrivateTenantRedirect from="/programEvaluation/freeThroughRecovery" />

                <PrivateTenantRoute path="/community/revocations" />
                <PrivateTenantRoute path="/community/goals" />
                <PrivateTenantRoute path="/community/explore" />
                <PrivateTenantRoute path="/facilities/goals" />
                <PrivateTenantRoute path="/facilities/explore" />
                <PrivateTenantRoute path="/programming/explore" />

                <PrivateRoute path="/profile" component={Profile} />
                <Route path="/verify" component={VerificationNeeded} />
                <Route component={NotFound} />
              </Switch>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
