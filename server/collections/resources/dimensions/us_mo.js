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
  DEFAULT_MONTHS,
  DEFAULT_REPORTED_VIOLATIONS,
  DEFAULT_METRIC_PERIOD_MONTHS,
  DEFAULT_GENDERS,
  DEFAULT_RACE,
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

const US_MO_DIMENSIONS = {
  charge_category: DEFAULT_CHARGE_CATEGORIES,
  gender: DEFAULT_GENDERS,
  metric_period_months: DEFAULT_METRIC_PERIOD_MONTHS,
  month: DEFAULT_MONTHS,
  race: DEFAULT_RACE,
  reported_violations: DEFAULT_REPORTED_VIOLATIONS,
  risk_level: DEFAULT_RISK_LEVEL,
  supervision_type: DEFAULT_SUPERVISION_TYPES,
  supervision_level: DEFAULT_SUPERVISION_LEVELS,
  violation_type: DEFAULT_VIOLATION_TYPES,
};

module.exports = { US_MO_DIMENSIONS };
