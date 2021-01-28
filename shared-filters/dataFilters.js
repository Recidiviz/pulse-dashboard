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
const { toInteger } = require("lodash/fp");
const { getFilterKeys } = require("./getFilterKeys");
const {
  nullSafeComparison,
  isAllItem,
  includesAllItemFirst,
} = require("./dataPointComparisons");

const {
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
} = getFilterKeys();

const matchesTopLevelFilters = ({
  filters,
  skippedFilters = [],
  treatCategoryAllAsAbsent = false,
}) => (item, dimensionKey = undefined) => {
  if (
    (dimensionKey === undefined || dimensionKey === "metric_period_months") &&
    filters[METRIC_PERIOD_MONTHS] &&
    !skippedFilters.includes(METRIC_PERIOD_MONTHS) &&
    !nullSafeComparison(
      item.metric_period_months,
      filters[METRIC_PERIOD_MONTHS]
    )
  ) {
    return false;
  }

  if (
    (dimensionKey === undefined || dimensionKey === "district") &&
    filters[DISTRICT] &&
    !skippedFilters.includes(DISTRICT) &&
    !(treatCategoryAllAsAbsent && includesAllItemFirst(filters[DISTRICT])) &&
    !nullSafeComparison(item.district, filters[DISTRICT])
  ) {
    return false;
  }

  if (
    (dimensionKey === undefined ||
      dimensionKey === "level_1_supervision_location") &&
    filters[LEVEL_1_SUPERVISION_LOCATION] &&
    !skippedFilters.includes(LEVEL_1_SUPERVISION_LOCATION) &&
    !(
      treatCategoryAllAsAbsent &&
      includesAllItemFirst(filters[LEVEL_1_SUPERVISION_LOCATION])
    ) &&
    !nullSafeComparison(
      item.level_1_supervision_location,
      filters[LEVEL_1_SUPERVISION_LOCATION]
    )
  ) {
    return false;
  }

  if (
    (dimensionKey === undefined ||
      dimensionKey === "level_2_supervision_location") &&
    filters[LEVEL_2_SUPERVISION_LOCATION] &&
    !skippedFilters.includes(LEVEL_2_SUPERVISION_LOCATION) &&
    !(
      treatCategoryAllAsAbsent &&
      includesAllItemFirst(filters[LEVEL_2_SUPERVISION_LOCATION])
    ) &&
    !nullSafeComparison(
      item.level_2_supervision_location,
      filters[LEVEL_2_SUPERVISION_LOCATION]
    )
  ) {
    return false;
  }

  if (
    (dimensionKey === undefined || dimensionKey === "charge_category") &&
    filters[CHARGE_CATEGORY] &&
    !skippedFilters.includes(CHARGE_CATEGORY) &&
    !(treatCategoryAllAsAbsent && isAllItem(filters[CHARGE_CATEGORY])) &&
    !nullSafeComparison(item.charge_category, filters[CHARGE_CATEGORY])
  ) {
    return false;
  }
  if (
    (dimensionKey === undefined || dimensionKey === "supervision_type") &&
    filters[SUPERVISION_TYPE] &&
    !skippedFilters.includes(SUPERVISION_TYPE) &&
    !(treatCategoryAllAsAbsent && isAllItem(filters[SUPERVISION_TYPE])) &&
    !nullSafeComparison(item.supervision_type, filters[SUPERVISION_TYPE])
  ) {
    return false;
  }
  if (
    (dimensionKey === undefined || dimensionKey === "admission_type") &&
    filters[ADMISSION_TYPE] &&
    !skippedFilters.includes(ADMISSION_TYPE) &&
    !includesAllItemFirst(filters[ADMISSION_TYPE]) &&
    !nullSafeComparison(item.admission_type, filters[ADMISSION_TYPE])
  ) {
    return false;
  }
  if (
    (dimensionKey === undefined || dimensionKey === "supervision_level") &&
    filters[SUPERVISION_LEVEL] &&
    !skippedFilters.includes(SUPERVISION_LEVEL) &&
    !nullSafeComparison(item.supervision_level, filters[SUPERVISION_LEVEL]) &&
    !(treatCategoryAllAsAbsent && isAllItem(filters[SUPERVISION_LEVEL]))
  ) {
    return false;
  }
  return true;
};

const matchesMatrixFilters = (filters) => (item, dimensionKey) => {
  if (
    (dimensionKey === undefined || dimensionKey === "violation_type") &&
    filters[VIOLATION_TYPE] &&
    !nullSafeComparison(item.violation_type, filters[VIOLATION_TYPE])
  ) {
    return false;
  }

  if (
    (dimensionKey === undefined || dimensionKey === "reported_violations") &&
    filters[REPORTED_VIOLATIONS] &&
    toInteger(item.reported_violations) !==
      toInteger(filters[REPORTED_VIOLATIONS])
  ) {
    return false;
  }
  return true;
};

const matchesAllFilters = ({
  filters,
  attrAccessors,
  skippedFilters = [],
  treatCategoryAllAsAbsent = false,
}) => (item, dimensionKey = undefined) => {
  const topLevelFilterFn = matchesTopLevelFilters({
    filters,
    attrAccessors,
    skippedFilters,
    treatCategoryAllAsAbsent,
  });
  const matrixFilterFn = matchesMatrixFilters(filters, attrAccessors);
  return (
    topLevelFilterFn(item, dimensionKey) && matrixFilterFn(item, dimensionKey)
  );
};

module.exports = {
  matchesAllFilters,
  matchesTopLevelFilters,
};
