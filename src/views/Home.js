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

import React from 'react';

import { useAuth0 } from '../react-auth0-spa';

const Home = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <main className="main-content bgc-grey-100">
      <div className="container" id="mainContent">
        <div className="row jc-c pT-40 pos-r">
          {isAuthenticated && (
            <div className="col-12 text-center">
              <h2>Dive in on the left</h2>
            </div>
          )}
          {!isAuthenticated && (
            <div className="col-12 text-center">
              <a className="d-b td-n pY-5 bgcH-grey-100 c-grey-700" href="#" onClick={() => loginWithRedirect({ appState: { targetUrl: '/snapshots' } })}>
                <i className="ti-power-off mR-10" />
                <h2>Log in to get started</h2>
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
