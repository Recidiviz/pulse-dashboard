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
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import logo from "../../assets/static/images/logo.png";

const SideBarHeader = ({ toggleSidebar }) => (
  <div className="sidebar-logo" style={{ height: "65px" }}>
    <div className="peers ai-c fxw-nw">
      <div className="peer peer-greed">
        <Link className="sidebar-link td-n" to="/">
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
        </Link>
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
);

SideBarHeader.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};

export default SideBarHeader;
