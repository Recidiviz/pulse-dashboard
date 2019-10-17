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

const genderLabelStringConversion = {
  FEMALE: 'Female',
  MALE: 'Male',
  TRANS: 'Trans',
  TRANS_FEMALE: 'Trans Female',
  TRANS_MALE: 'Trans Male',
};

const raceLabelStringConversion = {
  AMERICAN_INDIAN_ALASKAN_NATIVE: 'American Indian Alaskan Native',
  ASIAN: 'Asian',
  BLACK: 'Black',
  HISPANIC: 'Hispanic',
  NATIVE_HAWAIIAN_PACIFIC_ISLANDER: 'Native Hawaiian Pacific Islander',
  WHITE: 'White',
  OTHER: 'Other',
};

function genderValueToHumanReadable(genderValue) {
  return genderLabelStringConversion[genderValue];
}

function raceValueToHumanReadable(raceValue) {
  return raceLabelStringConversion[raceValue];
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

export {
  genderValueToHumanReadable,
  raceValueToHumanReadable,
  toHtmlFriendly,
  toHumanReadable,
  toInt,
};
