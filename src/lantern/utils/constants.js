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

export const METRIC_PERIOD_MONTHS = "metricPeriodMonths";
export const CHARGE_CATEGORY = "chargeCategory";
export const DISTRICT = "district";
export const LEVEL_1_SUPERVISION_LOCATION = "levelOneSupervisionLocation";
export const LEVEL_2_SUPERVISION_LOCATION = "levelTwoSupervisionLocation";
export const SUPERVISION_TYPE = "supervisionType";
export const SUPERVISION_LEVEL = "supervisionLevel";
export const REPORTED_VIOLATIONS = "reportedViolations";
export const VIOLATION_TYPE = "violationType";
export const ADMISSION_TYPE = "admissionType";

export const FILTER_TYPES = [
  METRIC_PERIOD_MONTHS,
  CHARGE_CATEGORY,
  DISTRICT,
  LEVEL_1_SUPERVISION_LOCATION,
  LEVEL_2_SUPERVISION_LOCATION,
  SUPERVISION_TYPE,
  SUPERVISION_LEVEL,
  REPORTED_VIOLATIONS,
  VIOLATION_TYPE,
  ADMISSION_TYPE,
];

export const FILTER_TYPE_MAP = {
  metric_period_months: METRIC_PERIOD_MONTHS,
  charge_category: CHARGE_CATEGORY,
  district: DISTRICT,
  level_1_supervision_location: LEVEL_1_SUPERVISION_LOCATION,
  level_2_supervision_location: LEVEL_2_SUPERVISION_LOCATION,
  supervision_type: SUPERVISION_TYPE,
  supervision_level: SUPERVISION_LEVEL,
  reported_violations: REPORTED_VIOLATIONS,
  violation_type: VIOLATION_TYPE,
  admission_type: ADMISSION_TYPE,
};
