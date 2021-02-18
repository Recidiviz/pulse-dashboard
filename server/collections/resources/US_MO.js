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
  COLLECTIONS,
  DEFAULT_MONTHS,
  DEFAULT_REPORTED_VIOLATIONS,
  DEFAULT_METRIC_PERIOD_MONTHS,
  DEFAULT_GENDERS,
  DEFAULT_RACE,
  removeAllValue,
} = require("./shared");

const DEFAULT_CHARGE_CATEGORIES = [
  "all",
  "domestic_violence",
  "general",
  "serious_mental_illness",
  "sex_offense",
  "external_unknown",
];

const DEFAULT_SUPERVISION_TYPES = [
  "all",
  "dual",
  "parole",
  "probation",
  "external_unknown",
];

const DEFAULT_SUPERVISION_LEVELS = ["all"];

const DEFAULT_VIOLATION_TYPES = [
  "absconded",
  "all",
  "elec_monitoring",
  "escaped",
  "felony",
  "high_tech",
  "low_tech",
  "med_tech",
  "misdemeanor",
  "municipal",
  "no_violation_type",
  "substance_abuse",
  "technical",
];

const DEFAULT_RISK_LEVEL = [
  "high",
  "low",
  "medium",
  "not_assessed",
  "very_high",
];

module.exports = {
  [COLLECTIONS.NEW_REVOCATION]: {
    supervision_location_restricted_access_emails: {
      filename: "supervision_location_restricted_access_emails.json",
    },
    revocations_matrix_by_month: {
      filename: "revocations_matrix_by_month.txt",
      dimensions: {
        charge_category: DEFAULT_CHARGE_CATEGORIES,
        month: DEFAULT_MONTHS,
        reported_violations: DEFAULT_REPORTED_VIOLATIONS,
        supervision_type: DEFAULT_SUPERVISION_TYPES,
        supervision_level: DEFAULT_SUPERVISION_LEVELS,
        violation_type: DEFAULT_VIOLATION_TYPES,
      },
    },
    revocations_matrix_cells: {
      filename: "revocations_matrix_cells.txt",
      dimensions: {
        charge_category: DEFAULT_CHARGE_CATEGORIES,
        metric_period_months: DEFAULT_METRIC_PERIOD_MONTHS,
        reported_violations: removeAllValue(DEFAULT_REPORTED_VIOLATIONS),
        supervision_type: DEFAULT_SUPERVISION_TYPES,
        supervision_level: DEFAULT_SUPERVISION_LEVELS,
        violation_type: removeAllValue(DEFAULT_VIOLATION_TYPES),
      },
    },
    revocations_matrix_distribution_by_district: {
      filename: "revocations_matrix_distribution_by_district.txt",
      dimensions: {
        charge_category: DEFAULT_CHARGE_CATEGORIES,
        metric_period_months: DEFAULT_METRIC_PERIOD_MONTHS,
        reported_violations: DEFAULT_REPORTED_VIOLATIONS,
        supervision_type: DEFAULT_SUPERVISION_TYPES,
        supervision_level: DEFAULT_SUPERVISION_LEVELS,
        violation_type: DEFAULT_VIOLATION_TYPES,
      },
    },
    revocations_matrix_distribution_by_gender: {
      filename: "revocations_matrix_distribution_by_gender.txt",
      dimensions: {
        risk_level: DEFAULT_RISK_LEVEL,
        gender: DEFAULT_GENDERS,
        charge_category: DEFAULT_CHARGE_CATEGORIES,
        metric_period_months: DEFAULT_METRIC_PERIOD_MONTHS,
        reported_violations: DEFAULT_REPORTED_VIOLATIONS,
        supervision_type: DEFAULT_SUPERVISION_TYPES,
        supervision_level: DEFAULT_SUPERVISION_LEVELS,
        violation_type: DEFAULT_VIOLATION_TYPES,
      },
    },
    revocations_matrix_distribution_by_officer: {
      filename: "revocations_matrix_distribution_by_officer.txt",
      dimensions: {
        risk_level: DEFAULT_RISK_LEVEL,
        charge_category: DEFAULT_CHARGE_CATEGORIES,
        metric_period_months: DEFAULT_METRIC_PERIOD_MONTHS,
        reported_violations: DEFAULT_REPORTED_VIOLATIONS,
        supervision_type: DEFAULT_SUPERVISION_TYPES,
        supervision_level: DEFAULT_SUPERVISION_LEVELS,
        violation_type: DEFAULT_VIOLATION_TYPES,
      },
    },
    revocations_matrix_distribution_by_race: {
      filename: "revocations_matrix_distribution_by_race.txt",
      dimensions: {
        risk_level: DEFAULT_RISK_LEVEL,
        race: DEFAULT_RACE,
        charge_category: DEFAULT_CHARGE_CATEGORIES,
        metric_period_months: DEFAULT_METRIC_PERIOD_MONTHS,
        reported_violations: DEFAULT_REPORTED_VIOLATIONS,
        supervision_type: DEFAULT_SUPERVISION_TYPES,
        supervision_level: DEFAULT_SUPERVISION_LEVELS,
        violation_type: DEFAULT_VIOLATION_TYPES,
      },
    },
    revocations_matrix_distribution_by_risk_level: {
      filename: "revocations_matrix_distribution_by_risk_level.txt",
      dimensions: {
        risk_level: DEFAULT_RISK_LEVEL,
        charge_category: DEFAULT_CHARGE_CATEGORIES,
        metric_period_months: DEFAULT_METRIC_PERIOD_MONTHS,
        reported_violations: DEFAULT_REPORTED_VIOLATIONS,
        supervision_type: DEFAULT_SUPERVISION_TYPES,
        supervision_level: DEFAULT_SUPERVISION_LEVELS,
        violation_type: DEFAULT_VIOLATION_TYPES,
      },
    },
    revocations_matrix_distribution_by_violation: {
      filename: "revocations_matrix_distribution_by_violation.txt",
      dimensions: {
        charge_category: DEFAULT_CHARGE_CATEGORIES,
        metric_period_months: DEFAULT_METRIC_PERIOD_MONTHS,
        reported_violations: DEFAULT_REPORTED_VIOLATIONS,
        supervision_type: DEFAULT_SUPERVISION_TYPES,
        supervision_level: DEFAULT_SUPERVISION_LEVELS,
        violation_type: DEFAULT_VIOLATION_TYPES,
      },
    },
    revocations_matrix_filtered_caseload: {
      filename: "revocations_matrix_filtered_caseload.txt",
      dimensions: {
        charge_category: removeAllValue(DEFAULT_CHARGE_CATEGORIES),
        metric_period_months: DEFAULT_METRIC_PERIOD_MONTHS,
        reported_violations: removeAllValue(DEFAULT_REPORTED_VIOLATIONS),
        supervision_type: removeAllValue(DEFAULT_SUPERVISION_TYPES),
        supervision_level: DEFAULT_SUPERVISION_LEVELS,
        violation_type: removeAllValue(DEFAULT_VIOLATION_TYPES),
      },
    },
  },
};
