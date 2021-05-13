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

const { query, param } = require("express-validator");
const { isDemoMode } = require("../utils/recidivizAccess");

const VALID_STATE_CODES = ["US_PA", "US_MO", "US_ND"].concat(
  isDemoMode ? ["US_DEMO"] : []
);
const CHARGE_CATEGORIES = [
  "alcohol_drug",
  "all",
  "domestic_violence",
  "general",
  "serious_mental_illness",
  "sex_offense",
];
const METRIC_PERIOD_MONTHS = ["12", "3", "36", "6", "1"];
const REPORTED_VIOLATIONS = ["1", "2", "3", "4", "5", "6", "7", "8", "all"];
const SUPERVISION_LEVELS = [
  "all",
  "electronic_monitoring_only",
  "enhanced",
  "high",
  "incarcerated",
  "maximum",
  "medium",
  "minimum",
  "special",
];
const SUPERVISION_TYPES = ["all", "dual", "parole", "probation"];
const VIOLATION_TYPES = [
  "absconded",
  "all",
  "elec_monitoring",
  "escaped",
  "felony",
  "high_tech",
  "law",
  "low_tech",
  "med_tech",
  "misdemeanor",
  "municipal",
  "substance_abuse",
  "technical",
];
const ADMISSION_TYPES = [
  "all",
  "legal_revocation",
  "shock_incarceration_0_to_6_months",
  "shock_incarceration_6_months",
  "shock_incarceration_9_months",
  "shock_incarceration_12_months",
  "shock_incarceration_pvc",
];

const newRevocationsParamValidations = [
  param("stateCode").toUpperCase().isIn(VALID_STATE_CODES),
  query("levelOneSupervisionLocation").optional(),
  query("levelTwoSupervisionLocation").optional(),
  query("chargeCategory").toLowerCase().optional().isIn(CHARGE_CATEGORIES),
  query("metricPeriodMonths")
    .toLowerCase()
    .optional()
    .isIn(METRIC_PERIOD_MONTHS),
  query("reportedViolations")
    .toLowerCase()
    .optional()
    .isIn(REPORTED_VIOLATIONS),
  query("supervisionLevel").toLowerCase().optional().isIn(SUPERVISION_LEVELS),
  query("supervisionType").toLowerCase().optional().isIn(SUPERVISION_TYPES),
  query("violationType").toLowerCase().optional().isIn(VIOLATION_TYPES),
  query("admissionType")
    .toLowerCase()
    .optional()
    .custom((values) =>
      values.every((value) => ADMISSION_TYPES.includes(value.toLowerCase()))
    ),
];

module.exports = {
  newRevocationsParamValidations,
};
