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

const STATE_NAME_BY_CODE = {
  us_mo: 'Missouri',
  us_nd: 'North Dakota',
  recidiviz: 'Recidiviz',
};

const METADATA_NAMESPACE = 'https://dashboard.recidiviz.org/';

function getUserAppMetadata(user) {
  const appMetadataKey = `${METADATA_NAMESPACE}app_metadata`;
  return user[appMetadataKey];
}

function getStateNameForCode(stateCode) {
  return STATE_NAME_BY_CODE[stateCode];
}

function getUserStateCode(user) {
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

function getUserStateName(user) {
  const stateCode = getUserStateCode(user);
  return getStateNameForCode(stateCode);
}

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
