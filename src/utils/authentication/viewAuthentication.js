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

import isDemoMode from './demoMode';
import { getUserStateCode } from './user';
import {
  getAvailableViewsForState, getCurrentStateForRecidivizUsers,
} from '../../views/stateViews';

/**
 * Returns an artificial Auth0 id token for a fake/demo user.
 */
function getDemoUser() {
  return {
    picture: 'https://ui-avatars.com/api/?name=Demo+Jones&background=0D8ABC&color=fff&rounded=true',
    name: 'Demo Jones',
    email: 'notarealemail@recidiviz.org',
    'https://dashboard.recidiviz.org/app_metadata': {
      state_code: 'RECIDIVIZ',
    },
  };
}

/**
 * A view that requires authentication can be shown if the user is authenticated
 * or if we are in demo mode.
 */
function canShowAuthenticatedView(isAuthenticated) {
  return isAuthenticated || isDemoMode();
}

/**
 * Returns whether or not the view with the given name is available for the given user, based on
 * their state.
 */
function isViewAvailableForUserState(user, view) {
  const stateCode = getUserStateCode(user);
  const normalizedCode = (stateCode.toLowerCase() === 'recidiviz')
    ? getCurrentStateForRecidivizUsers() : stateCode.toLowerCase();

  const permittedViews = getAvailableViewsForState(normalizedCode);
  if (!permittedViews) {
    // State is not present in permissions yet
    return false;
  }

  return permittedViews.includes(view.toLowerCase());
}

export {
  getDemoUser,
  canShowAuthenticatedView,
  isViewAvailableForUserState,
};
