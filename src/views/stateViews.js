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

import {
  isRecidivizUser,
  isLanternUser,
  getUserStateCode,
} from "../utils/authentication/user";

const ALL_STATE_CODES = ["us_mo", "us_nd", "us_pa"];
const LANTERN_STATE_CODES = ["us_mo"];
const CURRENT_STATE_IN_SESSION = "adminUserCurrentStateInSession";

/**
 * Returns is user user has access for specific state code.
 */
export function isUserHasAccess(user, stateCode) {
  if (!user) {
    return false;
  }

  if (isRecidivizUser(user)) {
    return true;
  }

  if (isLanternUser(user)) {
    return LANTERN_STATE_CODES.includes(stateCode);
  }

  const userStateCode = getUserStateCode(user);
  return userStateCode === stateCode;
}

/**
 * Returns the list of states which are accessible to admin users to view data for.
 */
export function getAvailableStateCodesForAdminUser(user) {
  if (isRecidivizUser(user)) {
    return ALL_STATE_CODES;
  }

  if (isLanternUser(user)) {
    return LANTERN_STATE_CODES;
  }

  // This function should only be called for admin users who have access to multiple states
  return [];
}

/*
 * For admin users, returns the current state that should be viewed. This is retrieved from
 * the sessionStorage cache if already set. Otherwise, picks the first available state in ABC order.
 */
export function getCurrentStateCodeForAdminUsers(user) {
  const fromStorage = sessionStorage.getItem(CURRENT_STATE_IN_SESSION);
  if (!fromStorage) {
    const availableStateCodes = getAvailableStateCodesForAdminUser(user);
    return availableStateCodes[0];
  }
  return fromStorage.toLowerCase();
}

/**
 * For admin users, sets the current state that should be viewed in the sessionStorage cache.
 */
export function setCurrentStateCodeForAdminUsers(stateCode) {
  sessionStorage.setItem(CURRENT_STATE_IN_SESSION, stateCode.toLowerCase());
}
