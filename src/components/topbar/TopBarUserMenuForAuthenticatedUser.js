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

import { getUserStateName } from "../../utils/authentication/user";

const TopBarUserMenuForAuthenticatedUser = ({ user, onLogout }) => (
  <li className="dropdown">
    <a
      href="?"
      className="dropdown-toggle no-after peers fxw-nw ai-c lh-1"
      data-toggle="dropdown"
    >
      <div className="peer mR-10">
        <img className="w-2r bdrs-50p" src={user.picture} alt="" />
      </div>
      <div className="peer">
        <ul className="fsz-sm c-grey-900">{user.name}</ul>
        <ul className="fsz-sm pT-3 c-grey-600">{getUserStateName(user)}</ul>
      </div>
    </a>
    <ul className="dropdown-menu fsz-sm">
      <li>
        <Link to="/profile" className="d-b td-n pY-5 bgcH-grey-100 c-grey-700">
          <i className="ti-user mR-10" />
          <span>Profile</span>
        </Link>
      </li>
      <li role="separator" className="divider" />
      <li>
        {/* The href below must be '#' to allow Auth0 to log out successfully. */}
        {/* eslint-disable jsx-a11y/anchor-is-valid */}
        <a
          href="#"
          className="d-b td-n pY-5 bgcH-grey-100 c-grey-700"
          onClick={onLogout}
        >
          <i className="ti-power-off mR-10" />
          <span>Logout</span>
        </a>
        {/* eslint-enable */}
      </li>
    </ul>
  </li>
);

TopBarUserMenuForAuthenticatedUser.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    picture: PropTypes.string,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default TopBarUserMenuForAuthenticatedUser;
