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
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import { useAuth0 } from '../react-auth0-spa';
import isDemoMode from '../utils/authentication/demoMode';
import { getUserStateCode } from '../utils/authentication/user';
import {
  canShowAuthenticatedView, isViewAvailableForUserState
} from '../utils/authentication/viewAuthentication';
import { getComponentForStateView } from '../views/stateViews';
import NotFound from '../views/NotFound';

const PrivateTenantRoute = ({ path, ...rest }) => {
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();

  useEffect(() => {
    const fn = async () => {
      if (!canShowAuthenticatedView(isAuthenticated)) {
        await loginWithRedirect({
          appState: { targetUrl: path },
        });
      }
    };
    fn();
  }, [isAuthenticated, loginWithRedirect, path]);

  if (!canShowAuthenticatedView(isAuthenticated)) {
    return null;
  }

  let render = null;
  if (!isViewAvailableForUserState(user, path)) {
    // If the user is authenticated but trying to access a view not available for their state, 404
    render = NotFound;
  } else {
    // Else, grab the correct component for that view for their state and send them to it
    const stateCode = getUserStateCode(user);
    const Component = getComponentForStateView(stateCode, path);
    render = (props) => (isAuthenticated === true || isDemoMode() === true
      ? <Component {...props} /> : null);
  }

  return <Route path={path} render={render} {...rest} />;
};

PrivateTenantRoute.propTypes = {
  path: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
};

export default PrivateTenantRoute;
