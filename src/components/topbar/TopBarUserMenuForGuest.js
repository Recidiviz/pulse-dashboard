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

import React, { useCallback } from "react";
import { Dropdown } from "react-bootstrap";

import { useAuth0 } from "../../react-auth0-spa";

const TopBarForGuest = () => {
  const { loginWithRedirect } = useAuth0();

  const onLogin = useCallback(
    (e) => {
      e.preventDefault();
      loginWithRedirect({ appState: { targetUrl: "/" } });
    },
    [loginWithRedirect]
  );

  return (
    <ul className="nav-right">
      <Dropdown as="li">
        <Dropdown.Toggle
          as="a"
          href="#"
          onClick={onLogin}
          className="no-after peers fxw-nw ai-c lh-1 ta-l"
        >
          <div className="peer mR-10">
            <i className="ti-power-off" />
          </div>
          <div className="peer">
            <span className="fsz-sm c-grey-900">Log in</span>
          </div>
        </Dropdown.Toggle>
      </Dropdown>
    </ul>
  );
};

export default TopBarForGuest;
