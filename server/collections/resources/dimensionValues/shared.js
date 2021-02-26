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
const DEFAULT_MONTHS = [
  "1",
  "10",
  "11",
  "12",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
];

// TODO #763 - Remove "0" reported violations from the validation
const DEFAULT_REPORTED_VIOLATIONS = [
  "all",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
];

const DEFAULT_GENDERS = ["external_unknown", "female", "male"];

const DEFAULT_METRIC_PERIOD_MONTHS = ["1", "12", "3", "36", "6"];

const DEFAULT_RACE = [
  "american_indian_alaskan_native",
  "asian",
  "black",
  "external_unknown",
  "hispanic",
  "white",
  "other",
];

const DEFAULT_ADMISSION_TYPES = [
  "all",
  "legal_revocation",
  "shock_incarceration_0_to_6_months",
  "shock_incarceration_6_months",
  "shock_incarceration_9_months",
  "shock_incarceration_12_months",
  "shock_incarceration_pvc",
];

function removeAllValue(dimensionValues) {
  // Do not remove "All" value if it's the only value
  if (dimensionValues.length === 1 && dimensionValues[0] === "all") {
    return dimensionValues;
  }
  const allIndex = dimensionValues.indexOf("all");
  if (allIndex < 0) return dimensionValues;
  const dimensionValuesCopy = [...dimensionValues];
  dimensionValuesCopy.splice(allIndex, 1);
  return dimensionValuesCopy;
}

module.exports = {
  DEFAULT_GENDERS,
  DEFAULT_RACE,
  DEFAULT_MONTHS,
  DEFAULT_REPORTED_VIOLATIONS,
  DEFAULT_METRIC_PERIOD_MONTHS,
  DEFAULT_ADMISSION_TYPES,
  removeAllValue,
};
