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
const COLLECTIONS = {
  NEW_REVOCATION: "newRevocation",
  COMMUNITY_GOALS: "communityGoals",
  COMMUNITY_EXPLORE: "communityExplore",
  FACILITIES_GOALS: "facilitiesGoals",
  FACILITIES_EXPLORE: "facilitiesExplore",
  PROGRAMMING_EXPLORE: "programmingExplore",
};

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

const DEFAULT_METRIC_PERIOD_MONTHS = ["1", "12", "3", "36", "6"];

module.exports = {
  COLLECTIONS,
  DEFAULT_MONTHS,
  DEFAULT_REPORTED_VIOLATIONS,
  DEFAULT_METRIC_PERIOD_MONTHS,
};
