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
