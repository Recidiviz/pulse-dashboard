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

import React, { useEffect } from 'react';

import * as $ from 'jquery';
import logo from '../assets/static/images/logo.png';

import { useAuth0 } from '../react-auth0-spa';
import { isViewAvailableForUserState } from '../utils/authentication/viewAuthentication';

const SideBar = () => {
  const { user } = useAuth0();

  // TODO: Replace this jQuery with an actual React NavLinks
  useEffect(() => {
    // Sidebar Activity Class
    const sidebarLinks = $('.sidebar').find('.sidebar-link');

    sidebarLinks
      .each((index, el) => {
        $(el).removeClass('active');
      })
      .filter(function () {
        const href = $(this).attr('href');
        const pattern = href[0] === '/' ? href.substr(1) : href;
        return pattern === (window.location.pathname).substr(1);
      })
      .addClass('active');
  });

  return (
    <div className="sidebar">
      <div className="sidebar-inner">
        {/* ### $Sidebar Header ### */}
        <div className="sidebar-logo" style={{ height: '65px' }}>
          <div className="peers ai-c fxw-nw">
            <div className="peer peer-greed">
              <a className="sidebar-link td-n" href="/">
                <div className="peers ai-c fxw-nw pT-15">
                  <div className="peer">
                    <div className="col-md-3 my-auto peer">
                      <img className="logo-icon-holder" src={logo} alt="Logo" />
                    </div>
                  </div>
                  <div className="col-md-9 my-auto peer peer-greed">
                    <h5 className="lh-1 mB-0 logo-text recidiviz-dark-green-text">Dashboard</h5>
                  </div>
                </div>
              </a>
            </div>
            <div className="peer">
              <div className="mobile-toggle sidebar-toggle">
                <a href="#" className="td-n">
                  <i className="ti-arrow-circle-left" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ### $Sidebar Menu ### */}
        <ul className="sidebar-menu scrollable pos-r">

          {isViewAvailableForUserState(user, '/snapshots') && (
          <li className="nav-item mT-30 active">
            <a className="sidebar-link" href="/snapshots">
              <span className="icon-holder">
                <i className="c-blue-500 ti-dashboard" />
              </span>
              <span className="title">Snapshots</span>
            </a>
          </li>
          )}

          {isViewAvailableForUserState(user, '/revocations') && (
          <li className="nav-item">
            <a className="sidebar-link" href="/revocations">
              <span className="icon-holder">
                <i className="c-brown-500 ti-unlink" />
              </span>
              <span className="title">Revocations</span>
            </a>
          </li>
          )}

          {isViewAvailableForUserState(user, '/reincarcerations') && (
          <li className="nav-item">
            <a className="sidebar-link" href="/reincarcerations">
              <span className="icon-holder">
                <i className="c-red-500 ti-reload" />
              </span>
              <span className="title">Reincarcerations</span>
            </a>
          </li>
          )}

          {isViewAvailableForUserState(user, '/programevaluation/freethroughrecovery') && (
          <li className="nav-item">
            <a className="sidebar-link" href="/programEvaluation/freeThroughRecovery">
              <span className="icon-holder">
                <i className="c-green-500 ti-location-arrow" />
              </span>
              <span className="title">Free Through Recovery</span>
            </a>
          </li>
          )}

          <li className="bottom-item">
            <a className="sidebar-link" id="feedback-link" href={process.env.REACT_APP_FEEDBACK_URL} target="_blank" rel="noopener noreferrer">
              <span className="icon-holder">
                <i className="c-grey-700 ti-comment" />
              </span>
              <span className="title">Feedback</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
