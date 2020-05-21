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
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

import logo from "../assets/static/images/logo.png";

const SideBar = ({ isUrlEnabled, toggleSidebar }) => {
  // useEffect(() => {
  //   // Sidebar Activity Class
  //   const sidebarLinks = $(".sidebar").find(".sidebar-link");

  //   sidebarLinks
  //     .each((index, el) => {
  //       $(el).removeClass("active");
  //     })
  //     .filter(function () {
  //       const href = $(this).attr("href");
  //       const pattern = href[0] === "/" ? href.substr(1) : href;
  //       return pattern === window.location.pathname.substr(1);
  //     })
  //     .addClass("active");
  // });

  return (
    <div className="sidebar">
      <div className="sidebar-inner">
        {/* ### $Sidebar Header ### */}
        <div className="sidebar-logo" style={{ height: "65px" }}>
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
                    <h5 className="lh-1 mB-0 logo-text recidiviz-dark-green-text">
                      Dashboard
                    </h5>
                  </div>
                </div>
              </a>
            </div>
            <div className="peer">
              <button
                type="button"
                className="mobile-toggle sidebar-toggle bds-n"
                onClick={toggleSidebar}
              >
                <div className="td-n" style={{ cursor: "pointer" }}>
                  <i className="ti-arrow-circle-left" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* ### $Sidebar Menu ### */}
        <ul className="sidebar-menu scrollable pos-r mT-30">
          {(isUrlEnabled("/community/goals") ||
            isUrlEnabled("/community/explore")) && (
            <li className="nav-item active">
              <div className="sidebar-group">
                <span className="icon-holder">
                  <i className="c-blue-500 ti-dashboard" />
                </span>
                <span className="title">Community</span>
              </div>
              <ul className="pos-r">
                <li className="nav-item">
                  <NavLink
                    to="/community/goals"
                    className="sidebar-link"
                    activeClassName="active"
                  >
                    Goals
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/community/explore"
                    className="sidebar-link"
                    activeClassName="active"
                  >
                    Explore
                  </NavLink>
                </li>
              </ul>
            </li>
          )}

          {isUrlEnabled("/revocations") && (
            <li className="nav-item">
              <div className="sidebar-group">
                <span className="icon-holder">
                  <i className="c-brown-500 ti-unlink" />
                </span>
                <span className="title">Facilities</span>
              </div>
            </li>
          )}

          {isUrlEnabled("/reincarcerations") && (
            <li className="nav-item">
              <div className="sidebar-group">
                <span className="icon-holder">
                  <i className="c-red-500 ti-reload" />
                </span>
                <span className="title">Programming</span>
              </div>
            </li>
          )}

          {isUrlEnabled("/programevaluation/freethroughrecovery") && (
            <li className="nav-item">
              <div className="sidebar-group">
                <span className="icon-holder">
                  <i className="c-green-500 ti-location-arrow" />
                </span>
                <span className="title">Free Through Recovery</span>
              </div>
            </li>
          )}

          <li className="bottom-item">
            <a
              className="sidebar-link"
              id="feedback-link"
              href={process.env.REACT_APP_FEEDBACK_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
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

SideBar.propTypes = {
  isUrlEnabled: PropTypes.func.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default SideBar;
