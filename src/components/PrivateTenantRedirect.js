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

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";

import { useAuth0 } from "../react-auth0-spa";
import { getRedirectedView } from "../utils/authentication/viewAuthentication";

const PrivateTenantRedirect = ({ from, ...rest }) => {
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();

  useEffect(() => {
    const fn = async () => {
      if (!isAuthenticated) {
        await loginWithRedirect({
          appState: { targetUrl: from },
        });
      }
    };
    fn();
  }, [isAuthenticated, loginWithRedirect, from]);

  if (!isAuthenticated) return null;

  const to = getRedirectedView(user, from);
  return <Redirect from={from} to={to} {...rest} />;
};

PrivateTenantRedirect.propTypes = {
  from: PropTypes.string.isRequired,
};

export default PrivateTenantRedirect;
