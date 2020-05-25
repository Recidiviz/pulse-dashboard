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

const TopBarForGuest = ({ onLogin }) => (
  <ul className="nav-right">
    <li className="dropdown">
      <a
        href="?"
        onClick={(event) => {
          event.preventDefault();
          onLogin();
        }}
        className="dropdown-toggle no-after peers fxw-nw ai-c lh-1"
        data-toggle="dropdown"
      >
        <div className="peer mR-10">
          <i className="ti-power-off" />
        </div>
        <div className="peer">
          <span className="fsz-sm c-grey-900">Log in</span>
        </div>
      </a>
    </li>
  </ul>
);

TopBarForGuest.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default TopBarForGuest;
