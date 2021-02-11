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
const {
  DEFAULT_MONTH,
  DEFAULT_REPORTED_VIOLATIONS,
  DEFAULT_METRIC_PERIOD_MONTHS,
  COMMUNITY_GOALS,
  COMMUNITY_EXPLORE,
  FACILITIES_GOALS,
  FACILITIES_EXPLORE,
  PROGRAMMING_EXPLORE,
} = require("./shared");

const DEFAULT_CHARGE_CATEGORY = [
  "domestic_violence",
  "general",
  "serious_mental_illness",
  "sex_offense",
];

const DEFAULT_SUPERVISION_TYPE = ["dual", "parole", "probation"];

const DEFAULT_SUPERVISION_LEVEL = ["all"];

const DEFAULT_VIOLATION_TYPE = [
  "absconded",
  "felony",
  "misdemeanor",
  "municipal",
  "substance_abuse",
  "technical",
];

const MATRIX_DISTRIBUTION_VIOLATION_TYPES = [
  "all",
  "elec_monitoring",
  "escaped",
  "high_tech",
  "low_tech",
  "med_tech",
  "no_violation_type",
];

const NEW_REVOCATIONS = {
  supervision_location_restricted_access_emails: {
    filename: "supervision_location_restricted_access_emails.json",
  },
  revocations_matrix_by_month: {
    filename: "revocations_matrix_by_month.txt",
    dimensions: {
      charge_category: DEFAULT_CHARGE_CATEGORY.concat(["all"]),
      month: DEFAULT_MONTH,
      reported_violations: DEFAULT_REPORTED_VIOLATIONS.concat(["all"]),
      supervision_type: DEFAULT_SUPERVISION_TYPE.concat(["all"]),
      supervision_level: DEFAULT_SUPERVISION_LEVEL,
      violation_type: DEFAULT_VIOLATION_TYPE.concat(["all"]),
    },
  },
  revocations_matrix_cells: {
    filename: "revocations_matrix_cells.txt",
    dimensions: {
      charge_category: DEFAULT_CHARGE_CATEGORY.concat(["all"]),
      metric_period_months: DEFAULT_METRIC_PERIOD_MONTHS,
      reported_violations: DEFAULT_REPORTED_VIOLATIONS,
      supervision_type: DEFAULT_SUPERVISION_TYPE.concat(["all"]),
      supervision_level: DEFAULT_SUPERVISION_LEVEL,
      violation_type: DEFAULT_VIOLATION_TYPE,
    },
  },
  revocations_matrix_distribution_by_district: {
    filename: "revocations_matrix_distribution_by_district.txt",
    dimensions: {
      charge_category: DEFAULT_CHARGE_CATEGORY.concat(["all"]),
      metric_period_months: DEFAULT_METRIC_PERIOD_MONTHS,
      reported_violations: DEFAULT_REPORTED_VIOLATIONS.concat(["all"]),
      supervision_type: DEFAULT_SUPERVISION_TYPE.concat(["all"]),
      supervision_level: DEFAULT_SUPERVISION_LEVEL,
      violation_type: DEFAULT_VIOLATION_TYPE.concat(
        MATRIX_DISTRIBUTION_VIOLATION_TYPES
      ),
    },
  },
  revocations_matrix_distribution_by_gender: {
    filename: "revocations_matrix_distribution_by_gender.txt",
    dimensions: {
      charge_category: DEFAULT_CHARGE_CATEGORY.concat(["all"]),
      metric_period_months: DEFAULT_METRIC_PERIOD_MONTHS,
      reported_violations: DEFAULT_REPORTED_VIOLATIONS.concat(["all"]),
      supervision_type: DEFAULT_SUPERVISION_TYPE.concat(["all"]),
      supervision_level: DEFAULT_SUPERVISION_LEVEL,
      violation_type: DEFAULT_VIOLATION_TYPE.concat(
        MATRIX_DISTRIBUTION_VIOLATION_TYPES
      ),
    },
  },
  revocations_matrix_distribution_by_officer: {
    filename: "revocations_matrix_distribution_by_officer.txt",
    dimensions: {
      charge_category: DEFAULT_CHARGE_CATEGORY.concat(["all"]),
      metric_period_months: DEFAULT_METRIC_PERIOD_MONTHS,
      reported_violations: DEFAULT_REPORTED_VIOLATIONS.concat(["all"]),
      supervision_type: DEFAULT_SUPERVISION_TYPE.concat(["all"]),
      supervision_level: DEFAULT_SUPERVISION_LEVEL,
      violation_type: DEFAULT_VIOLATION_TYPE.concat(
        MATRIX_DISTRIBUTION_VIOLATION_TYPES
      ),
    },
  },
  revocations_matrix_distribution_by_race: {
    filename: "revocations_matrix_distribution_by_race.txt",
    dimensions: {
      charge_category: DEFAULT_CHARGE_CATEGORY.concat(["all"]),
      metric_period_months: DEFAULT_METRIC_PERIOD_MONTHS,
      reported_violations: DEFAULT_REPORTED_VIOLATIONS.concat(["all"]),
      supervision_type: DEFAULT_SUPERVISION_TYPE.concat(["all"]),
      supervision_level: DEFAULT_SUPERVISION_LEVEL,
      violation_type: DEFAULT_VIOLATION_TYPE.concat(
        MATRIX_DISTRIBUTION_VIOLATION_TYPES
      ),
    },
  },
  revocations_matrix_distribution_by_risk_level: {
    filename: "revocations_matrix_distribution_by_risk_level.txt",
    dimensions: {
      charge_category: DEFAULT_CHARGE_CATEGORY.concat(["all"]),
      metric_period_months: DEFAULT_METRIC_PERIOD_MONTHS,
      reported_violations: DEFAULT_REPORTED_VIOLATIONS.concat(["all"]),
      supervision_type: DEFAULT_SUPERVISION_TYPE.concat(["all"]),
      supervision_level: DEFAULT_SUPERVISION_LEVEL,
      violation_type: DEFAULT_VIOLATION_TYPE.concat(
        MATRIX_DISTRIBUTION_VIOLATION_TYPES
      ),
    },
  },
  revocations_matrix_distribution_by_violation: {
    filename: "revocations_matrix_distribution_by_violation.txt",
    dimensions: {
      charge_category: DEFAULT_CHARGE_CATEGORY.concat(["all"]),
      metric_period_months: DEFAULT_METRIC_PERIOD_MONTHS,
      reported_violations: DEFAULT_REPORTED_VIOLATIONS.concat(["all"]),
      supervision_type: DEFAULT_SUPERVISION_TYPE.concat(["all"]),
      supervision_level: DEFAULT_SUPERVISION_LEVEL,
      violation_type: DEFAULT_VIOLATION_TYPE.concat(
        MATRIX_DISTRIBUTION_VIOLATION_TYPES
      ),
    },
  },
  revocations_matrix_filtered_caseload: {
    filename: "revocations_matrix_filtered_caseload.txt",
    dimensions: {
      charge_category: DEFAULT_CHARGE_CATEGORY,
      metric_period_months: DEFAULT_METRIC_PERIOD_MONTHS,
      reported_violations: DEFAULT_REPORTED_VIOLATIONS,
      supervision_type: DEFAULT_SUPERVISION_TYPE,
      supervision_level: DEFAULT_SUPERVISION_LEVEL,
      violation_type: DEFAULT_VIOLATION_TYPE.concat([
        "all",
        "no_violation_type",
      ]),
    },
  },
};

module.exports = {
  NEW_REVOCATIONS,
  COMMUNITY_GOALS,
  COMMUNITY_EXPLORE,
  FACILITIES_GOALS,
  FACILITIES_EXPLORE,
  PROGRAMMING_EXPLORE,
};
