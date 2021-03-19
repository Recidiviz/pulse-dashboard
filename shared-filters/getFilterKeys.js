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
const FILTER_KEYS = {
  SERVER: {
    METRIC_PERIOD_MONTHS: "metric_period_months",
    CHARGE_CATEGORY: "charge_category",
    DISTRICT: "district",
    LEVEL_1_SUPERVISION_LOCATION: "level_1_supervision_location",
    LEVEL_2_SUPERVISION_LOCATION: "level_2_supervision_location",
    SUPERVISION_TYPE: "supervision_type",
    SUPERVISION_LEVEL: "supervision_level",
    REPORTED_VIOLATIONS: "reported_violations",
    VIOLATION_TYPE: "violation_type",
    ADMISSION_TYPE: "admission_type",
  },
  APP: {
    METRIC_PERIOD_MONTHS: "metricPeriodMonths",
    CHARGE_CATEGORY: "chargeCategory",
    DISTRICT: "district",
    LEVEL_1_SUPERVISION_LOCATION: "levelOneSupervisionLocation",
    LEVEL_2_SUPERVISION_LOCATION: "levelTwoSupervisionLocation",
    SUPERVISION_TYPE: "supervisionType",
    SUPERVISION_LEVEL: "supervisionLevel",
    REPORTED_VIOLATIONS: "reportedViolations",
    VIOLATION_TYPE: "violationType",
    ADMISSION_TYPE: "admissionType",
  },
};

function getFilterKeys() {
  if (process.env.REACT_APP_API_URL) {
    return FILTER_KEYS.APP;
  }
  return FILTER_KEYS.SERVER;
}

module.exports = { getFilterKeys };
