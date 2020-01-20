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

const STATE_NAME_BY_CODE = {
  us_mo: 'Missouri',
  us_nd: 'North Dakota',
  recidiviz: 'Recidiviz',
};

const METADATA_NAMESPACE = 'https://dashboard.recidiviz.org/';

/**
 * Returns the Auth0 app_metadata for the given user id token.
 */
function getUserAppMetadata(user) {
  const appMetadataKey = `${METADATA_NAMESPACE}app_metadata`;
  return user[appMetadataKey];
}

/**
 * Returns the human-readable state name for the given state code,
 * e.g. getStateNameForCode('us_nd') = 'North Dakota'
 */
function getStateNameForCode(stateCode) {
  return STATE_NAME_BY_CODE[stateCode.toLowerCase()];
}

/**
 * Returns the state code of the authorized state for the given user.
 * For Recidiviz users, this will be 'recidiviz'.
 */
function getUserStateCode(user) {
  if (isDemoMode()) {
    return 'recidiviz';
  }

  const appMetadata = getUserAppMetadata(user);
  if (!appMetadata) {
    throw Error('No app_metadata available for user');
  }

  const stateCode = appMetadata.state_code;
  if (stateCode) {
    return stateCode;
  }
  throw Error('No state code set for user');
}

/**
 * Returns the human-readable state name for the authorized state code for the given usere.
 */
function getUserStateName(user) {
  const stateCode = getUserStateCode(user);
  return getStateNameForCode(stateCode);
}

/**
 * Returns whether or not the given user is a Recidiviz user, i.e. has access to all states.
 */
function isRecidivizUser(user) {
  const stateCode = getUserStateCode(user);
  return stateCode.toLowerCase() === 'recidiviz';
}

export {
  getStateNameForCode,
  getUserStateCode,
  getUserStateName,
  isRecidivizUser,
};
