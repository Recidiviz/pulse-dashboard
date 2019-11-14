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

function isDemoMode() {
  return process.env.REACT_APP_IS_DEMO === 'true';
}

function getDemoUser() {
  return {
    picture: 'https://ui-avatars.com/api/?name=Demo+Jones&background=0D8ABC&color=fff&rounded=true',
    name: 'Demo Jones',
    email: 'notarealemail@recidiviz.org',
  };
}

/**
 * A view that requires authentication can be shown if the user is authenticated
 * or if we are in demo mode.
 */
function canShowAuthenticatedView(isAuthenticated) {
  return isAuthenticated || isDemoMode();
}

export {
  isDemoMode,
  getDemoUser,
  canShowAuthenticatedView,
};
