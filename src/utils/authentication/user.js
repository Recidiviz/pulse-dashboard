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

import tenants from "../../tenants";

export const METADATA_NAMESPACE = "https://dashboard.recidiviz.org/";

/**
 * Returns the Auth0 app_metadata for the given user id token.
 */
export function getUserAppMetadata(user) {
  const appMetadataKey = `${METADATA_NAMESPACE}app_metadata`;
  return user[appMetadataKey];
  // return { state_code: "us_mo", district: "01", region: "Western Region" }
}

/**
 * Returns the human-readable state name for the given state code,
 * e.g. getStateNameForCode('us_nd') = 'North Dakota'
 */
export function getStateNameForCode(stateCode) {
  return tenants[stateCode].name;
}

/**
 * Returns the state code of the authorized state for the given user.
 * For Recidiviz users or users in demo mode, this will be 'recidiviz'.
 */
export function getUserStateCode(user) {
  const appMetadata = getUserAppMetadata(user);
  if (!appMetadata) {
    throw Error("No app_metadata available for user");
  }

  const stateCode = appMetadata.state_code;
  if (stateCode) {
    return stateCode.toLowerCase();
  }
  throw Error("No state code set for user");
}

/**
 * Returns the human-readable state name for the authorized state code for the given usere.
 */
export function getUserStateName(user) {
  const stateCode = getUserStateCode(user);
  return getStateNameForCode(stateCode);
}

/**
 * Returns the list of states which are accessible to users to view data for.
 */
export function getAvailableStateCodes(user) {
  const stateCode = getUserStateCode(user);
  return tenants[stateCode].availableStateCodes;
}

/**
 * Returns is user user has access for specific state code.
 */
export function doesUserHaveAccess(user, stateCode) {
  return getAvailableStateCodes(user).includes(stateCode);
}
