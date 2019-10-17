// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2019 Recidiviz, Inc.
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

import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router, Redirect, Route, Switch,
} from 'react-router-dom';

import * as $ from 'jquery';

import PrivateRoute from './components/PrivateRoute';
import Loading from './components/Loading';
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';
import Footer from './components/Footer';
import { canShowAuthenticatedView } from './utils/viewAuthentication';
import Home from './views/Home';
import NotFound from './views/NotFound';
import Profile from './views/Profile';
import FreeThroughRecovery from './views/FreeThroughRecovery';
import Revocations from './views/Revocations';
import Reincarcerations from './views/Reincarcerations';
import Snapshots from './views/Snapshots';
import { useAuth0 } from './react-auth0-spa';
import './assets/scripts/index';

// styles
import './assets/styles/index.scss';

// fontawesome
import initFontAwesome from './utils/initFontAwesome';

initFontAwesome();

const App = () => {
  const [sideBarCollapsed, setSideBarCollapsed] = useState('');
  const { loading, isAuthenticated } = useAuth0();

  function toggleCollapsed() {
    const currentlyCollapsed = sideBarCollapsed === 'is-collapsed';
    if (currentlyCollapsed) {
      setSideBarCollapsed('');
    } else {
      setSideBarCollapsed('is-collapsed');
    }
  }

  // TODO: Replace this jQuery with actual React toggle components
  useEffect(() => {
    // ٍSidebar Toggle
    $('.sidebar-toggle').on('click', (e) => {
      toggleCollapsed();
      e.preventDefault();
    });

    /**
     * Wait until sidebar fully toggled (animated in/out)
     * then trigger window resize event in order to recalculate
     * masonry layout widths and gutters.
     */
    $('#sidebar-toggle').click((e) => {
      e.preventDefault();
      setTimeout(() => {
        window.dispatchEvent(window.EVENT);
      }, 300);
    });
  });

  if (loading) {
    return <Loading />;
  }

  let containerClass = 'wide-page-container';
  if (canShowAuthenticatedView(isAuthenticated)) {
    containerClass = 'page-container';
  }

  return (
    <Router>
      <div id="app" className={sideBarCollapsed}>
        <div>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <title>North Dakota</title>
          <div>
            {canShowAuthenticatedView(isAuthenticated) && (
            <SideBar />
            )}
            <div className={containerClass}>
              <TopBar pathname={window.location.pathname} />
              <Switch>
                <Route exact path="/">
                  {canShowAuthenticatedView(isAuthenticated) ? <Redirect to="/snapshots" /> : <Home />}
                </Route>
                <PrivateRoute path="/snapshots" component={Snapshots} />
                <PrivateRoute path="/revocations" component={Revocations} />
                <PrivateRoute path="/reincarcerations" component={Reincarcerations} />
                <PrivateRoute path="/programEvaluation/freeThroughRecovery" component={FreeThroughRecovery} />
                <PrivateRoute path="/profile" component={Profile} />
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
