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
const { US_MO } = require("../constants/stateCodes");
/**
 * Utilities for running the backend for recidiviz developers.
 */
function getIsDemoMode() {
  return process.env.IS_DEMO === "true";
}

const requestIsFromRecidivizUser = (userStateCode, requestStateCode) =>
  userStateCode !== requestStateCode && userStateCode === "recidiviz";

/**
 * Allow recidiviz users to test restricted access based on the requested
 * state code.
 */
function restrictAccessForRecidivizUser({
  requestStateCode,
  userStateCode,
  userRestrictions,
}) {
  return (
    requestIsFromRecidivizUser(userStateCode, requestStateCode) &&
    requestStateCode === US_MO &&
    userRestrictions &&
    userRestrictions.length > 0
  );
}

module.exports = {
  isDemoMode: getIsDemoMode(),
  restrictAccessForRecidivizUser,
  requestIsFromRecidivizUser,
};
