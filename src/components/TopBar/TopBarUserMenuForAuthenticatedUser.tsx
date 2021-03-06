// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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

import { observer } from "mobx-react-lite";
import React, { useCallback } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useUserStore } from "../StoreProvider";

type PropTypes = {
  hideUsername?: boolean;
  handleOnProfileClick?: () => void;
};

const TopBarUserMenuForAuthenticatedUser: React.FC<PropTypes> = ({
  hideUsername = false,
}) => {
  const { user, logout, stateName } = useUserStore();

  const onLogout = useCallback(
    (e) => {
      e.preventDefault();
      logout({ returnTo: window.location.origin });
    },
    [logout]
  );

  return (
    <Dropdown as="li">
      <Dropdown.Toggle
        variant="link"
        className="TopBarUserMenuForAuthenticatedUser no-after peers fxw-nw ai-c lh-1 ta-l"
      >
        <div className="peer mR-10">
          <img className="w-2r bdrs-50p" src={user.picture} alt="" />
        </div>
        {!hideUsername && (
          <div className="peer">
            <ul className="fsz-sm c-grey-900">{user.name}</ul>
            <ul className="fsz-sm pT-3 c-grey-600">{stateName}</ul>
          </div>
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu renderOnMount as="ul" className="dropdown-menu fsz-sm">
        <Dropdown.Item
          as={Link}
          to="/profile"
          className="TopBarUserMenuForAuthenticatedUser__profile-link d-b td-n pX-15"
        >
          <i className="ti-user mR-10" />
          <span>Profile</span>
        </Dropdown.Item>
        <Dropdown.Divider role="separator" />
        <Dropdown.Item
          as="a"
          href="#"
          className="TopBarUserMenuForAuthenticatedUser__logout d-b td-n pX-15"
          onClick={onLogout}
        >
          <i className="ti-power-off mR-10" />
          <span>Logout</span>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default observer(TopBarUserMenuForAuthenticatedUser);
