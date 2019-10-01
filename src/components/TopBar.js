import React, { useState } from 'react';

import { useAuth0 } from '../react-auth0-spa';
import { capitalizeWords, replaceAll } from '../assets/scripts/utils/strings';

const TopBar = (props) => {
  const noDash = replaceAll(props.pathname, '-', ' ');
  let noSlash = replaceAll(noDash, '/', '');
  if (!noSlash) {
    noSlash = 'Home';
  }
  const normalizedPath = capitalizeWords(noSlash);

  const [isOpen, setIsOpen] = useState(false);
  const {
    user, isAuthenticated, loginWithRedirect, logout,
  } = useAuth0();
  const toggle = () => setIsOpen(!isOpen);

  const logoutWithRedirect = () => logout({ returnTo: window.location.origin });

  let navBarClass = 'header navbar';
  if (!isAuthenticated) {
    navBarClass = 'header wide-navbar';
  }

  return (
    <div className={navBarClass}>
      <div className="header-container">
        <ul className="nav-left">
          {isAuthenticated && (
          <li>
            <a id="sidebar-toggle" className="sidebar-toggle" href="javascript:void(0);">
              <i className="ti-menu" />
            </a>
          </li>
          )}
          <li style={{ paddingLeft: '20px', paddingTop: '22px' }}>
            <h5 className="lh-1 mB-0 logo-text recidiviz-dark-green-text">{normalizedPath}</h5>
          </li>
        </ul>
        <ul className="nav-right">
          {!isAuthenticated && (
            <li className="dropdown">
              <a href="#" onClick={() => loginWithRedirect({ appState: { targetUrl: '/snapshots' } })} className="dropdown-toggle no-after peers fxw-nw ai-c lh-1" data-toggle="dropdown">
                <div className="peer mR-10">
                  <i className="ti-power-off" />
                </div>
                <div className="peer">
                  <span className="fsz-sm c-grey-900">Log in</span>
                </div>
              </a>
            </li>
          )}
          {isAuthenticated && (
            <li className="dropdown">
              <a href="#" className="dropdown-toggle no-after peers fxw-nw ai-c lh-1" data-toggle="dropdown">
                <div className="peer mR-10">
                  <img className="w-2r bdrs-50p" src={user.picture} alt="" />
                </div>
                <div className="peer">
                  <span className="fsz-sm c-grey-900">{user.name}</span>
                </div>
              </a>
              <ul className="dropdown-menu fsz-sm">
                <li>
                  <a href="/profile" className="d-b td-n pY-5 bgcH-grey-100 c-grey-700">
                    <i className="ti-user mR-10" />
                    <span>Profile</span>
                  </a>
                </li>
                <li role="separator" className="divider" />
                <li>
                  <a className="d-b td-n pY-5 bgcH-grey-100 c-grey-700" href="#" onClick={() => logoutWithRedirect({})}>
                    <i className="ti-power-off mR-10" />
                    <span>Logout</span>
                  </a>
                </li>
              </ul>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TopBar;
