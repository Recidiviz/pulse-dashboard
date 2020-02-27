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

const riskLevelValuetoLabel = {
  NOT_ASSESSED: 'Not Assessed',
  LOW: 'Low',
  MEDIUM: 'Moderate',
  HIGH: 'High',
  VERY_HIGH: 'Very high',
};

const genderValuetoLabel = {
  FEMALE: 'Female',
  MALE: 'Male',
  TRANS: 'Trans',
  TRANS_FEMALE: 'Trans Female',
  TRANS_MALE: 'Trans Male',
};

const raceValuetoLabel = {
  AMERICAN_INDIAN_ALASKAN_NATIVE: 'American Indian Alaskan Native',
  ASIAN: 'Asian',
  BLACK: 'Black',
  HISPANIC: 'Hispanic',
  NATIVE_HAWAIIAN_PACIFIC_ISLANDER: 'Native Hawaiian Pacific Islander',
  WHITE: 'White',
  OTHER: 'Other',
};

const technicalViolationTypes = [
  'travelCount', 'residencyCount', 'employmentCount', 'associationCount', 'directiveCount',
  'supervisionStrategyCount', 'interventionFeeCount', 'specialCount',
];

const lawViolationTypes = [
  'substanceCount', 'municipalCount', 'abscondedCount', 'misdemeanorCount', 'felonyCount',
];

const violationTypeToLabel = {
  abscondedCount: 'Absconsion',
  associationCount: 'Association',
  directiveCount: 'Report / Directives',
  employmentCount: 'Employment',
  felonyCount: 'Felony',
  interventionFeeCount: 'Intervention Fees',
  misdemeanorCount: 'Misdemeanor',
  municipalCount: 'Municipal',
  residencyCount: 'Residency',
  specialCount: 'Special Conditions',
  substanceCount: 'Substance Use',
  supervisionStrategyCount: 'Supervision Strategies',
  travelCount: 'Travel',
  weaponCount: 'Weapons',
};

function genderValueToHumanReadable(genderValue) {
  return genderValuetoLabel[genderValue];
}

function raceValueToHumanReadable(raceValue) {
  return raceValuetoLabel[raceValue];
}

function toHtmlFriendly(string) {
  return string.replace(' ', '-');
}

function toHumanReadable(string) {
  let newString = string.replace('-', ' ');
  newString = newString.replace('_', ' ');
  return newString;
}

function toInt(nonInt) {
  return parseInt(nonInt, 10);
}

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  );
}

function humanReadableTitleCase(str) {
  return toTitleCase(toHumanReadable(str));
}

/*
 * Returns the officer id from the canonical id format, '123: Firstname Lastname'.
 */
function numberFromOfficerId(officerId) {
  // This works even for the described format, correctly parsing out 123
  return toInt(officerId);
}

/*
 * Returns the officer name from the canonical id format, '123: Firstname Lastname'.
 */
function nameFromOfficerId(officerId) {
  if (!officerId) {
    return '';
  }

  const parts = officerId.split(':');
  if (parts.length === 1) {
    return officerId;
  }
  return parts[1].trim();
}

export {
  riskLevelValuetoLabel,
  violationTypeToLabel,
  technicalViolationTypes,
  lawViolationTypes,
  genderValueToHumanReadable,
  raceValueToHumanReadable,
  toHtmlFriendly,
  toHumanReadable,
  toInt,
  toTitleCase,
  humanReadableTitleCase,
  numberFromOfficerId,
  nameFromOfficerId,
};
