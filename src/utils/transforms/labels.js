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

import lowerCase from "lodash/fp/lowerCase"
import pipe from "lodash/fp/pipe";
import startCase from "lodash/fp/startCase"

const riskLevels = [
  "NOT_ASSESSED",
  "LOW",
  "MEDIUM",
  "HIGH",
  "VERY_HIGH",
];

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

const matrixViolationTypeToLabel = {
  TECHNICAL: "Technical",
  SUBSTANCE_ABUSE: "Subs. Use",
  MUNICIPAL: "Municipal",
  ABSCONDED: "Absconsion",
  MISDEMEANOR: "Misdemeanor",
  FELONY: "Felony",
  LOW_TECH: "Low tech.",
  MED_TECH: "MED tech.",
  ELEC_MONITORING: "Elec. monitoring",
  SUBS_USE: "Subs. use",
  ABSCONDING: "Absconding",
  HIGH_TECH: "High tech",
  SUMMARY_OFFENSE: "Summary offense",
};

const violationTypeToLabel = {
  absconding_count: 'Absconding',
  absconded_count: 'Absconsion',
  association_count: 'Association',
  directive_count: 'Report / Directives',
  elec_monitoring_count: 'Elec. monitoring',
  employment_count: 'Employment',
  felony_count: 'Felony',
  high_tech_count: 'High tech',
  intervention_fee_count: 'Intervention Fees',
  low_tech_count: 'Low tech',
  med_tech_count: 'Med. tech.',
  misdemeanor_count: 'Misdemeanor',
  municipal_count: 'Municipal',
  residency_count: 'Residency',
  special_count: 'Special Conditions',
  substance_count: 'Substance Use',
  subs_use_count: 'Subs. use',
  summary_offense_count: 'Summary offense',
  supervision_strategy_count: 'Supervision Strategies',
  travel_count: 'Travel',
  weapon_count: 'Weapons',
};

function genderValueToHumanReadable(genderValue) {
  return genderValuetoLabel[genderValue];
}

function raceValueToHumanReadable(raceValue) {
  return raceValuetoLabel[raceValue];
}

function toHtmlFriendly(string) {
  return string.replace(/ /g, '-');
}

function toHumanReadable(string) {
  let newString = string.replace(/-/g, ' ');
  newString = newString.replace(/_/g, ' ');
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

const humanReadableTitleCase = pipe(lowerCase, startCase);

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

const violationCountLabel = (count) => (count === '8' ? '8+' : count);

export {
  riskLevels,
  riskLevelValuetoLabel,
  violationTypeToLabel,
  matrixViolationTypeToLabel,
  genderValueToHumanReadable,
  raceValueToHumanReadable,
  toHtmlFriendly,
  toHumanReadable,
  toInt,
  toTitleCase,
  humanReadableTitleCase,
  numberFromOfficerId,
  nameFromOfficerId,
  violationCountLabel,
};
