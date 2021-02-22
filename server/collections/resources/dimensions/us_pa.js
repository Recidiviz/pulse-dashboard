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

const DEFAULT_SUPERVISION_LEVELS = [
  "all",
  "electronic_monitoring_only",
  "enhanced",
  "external_unknown",
  "maximum",
  "medium",
  "minimum",
  "special",
];

const DEFAULT_VIOLATION_TYPES = [
  "absconded",
  "all",
  "elec_monitoring",
  "escaped",
  "high_tech",
  "law",
  "low_tech",
  "med_tech",
  "municipal",
  "no_violation_type",
  "substance_abuse",
  "technical",
];

const DEFAULT_SUPERVISION_TYPES = ["all"];

const DEFAULT_CHARGE_CATEGORIES = ["all"];

const DEFAULT_RISK_LEVEL = ["high", "low", "medium", "not_assessed"];

const US_PA_DIMENSIONS = {
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

module.exports = { US_PA_DIMENSIONS };
