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
const { intersection } = require("lodash");

const SUBSET_MANIFEST = [
  // TODO: Uncomment "violation_type" and remove "charge_category" when the frontend is ready for unnested violation type values
  // Keeping this commented here so that it's easy to test locally while reviewing the PR.
  // [
  //   "violation_type",
  //   [
  //     [
  //       "absconded",
  //       "all",
  //       "elec_monitoring",
  //       "escaped",
  //       "high_tech",
  //       "low_tech",
  //       "med_tech",
  //       "municipal",
  //       "no_violation_type",
  //       "substance_abuse",
  //       "technical",
  //     ],
  //     ["felony", "law", "misdemeanor"],
  //   ],
  // ],
  [
    "charge_category",
    [
      ["all", "domestic_violence", "general", "serious_mental_illness"],
      ["sex_offense"],
    ],
  ],
];

const INVALID_SUBSET_DIMENSIONS = ["district"];

const FILES_WITH_SUBSETS = [
  "revocations_matrix_distribution_by_district",
  "revocations_matrix_distribution_by_gender",
  "revocations_matrix_distribution_by_officer",
  "revocations_matrix_distribution_by_race",
  "revocations_matrix_distribution_by_risk_level",
  "revocations_matrix_distribution_by_violation",
];

function validateSubsetManifest() {
  const dimensions = SUBSET_MANIFEST.map((d) => d[0]);
  return intersection(dimensions, INVALID_SUBSET_DIMENSIONS).length === 0;
}

function getSubsetManifest() {
  if (!validateSubsetManifest()) {
    throw new Error(
      `Found invalid subset dimension in the SUBSET_MANIFEST: ${INVALID_SUBSET_DIMENSIONS}`
    );
  }
  return SUBSET_MANIFEST;
}

module.exports = {
  getSubsetManifest,
  FILES_WITH_SUBSETS,
};
