// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
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

import { get } from "mobx";

import {
  matrixViolationTypeToLabel,
  toInt,
  violationCountLabel,
} from "../../../utils/transforms/labels";
import {
  nullSafeComparison,
  nullSafeComparisonForArray,
  isAllItem,
  includesAllItemFirst,
} from "../../../utils/charts/dataPointComparisons";
import {
  ADMISSION_TYPE,
  CHARGE_CATEGORY,
  DISTRICT,
  METRIC_PERIOD_MONTHS,
  REPORTED_VIOLATIONS,
  SUPERVISION_LEVEL,
  SUPERVISION_TYPE,
  VIOLATION_TYPE,
  LEVEL_1_SUPERVISION_LOCATION,
  LEVEL_2_SUPERVISION_LOCATION,
} from "../../../constants/filterTypes";

export const matchesTopLevelFilters = ({
  filters,
  skippedFilters = [],
  treatCategoryAllAsAbsent = false,
}) => (item, dimensionKey = undefined) => {
  if (
    (dimensionKey === undefined || dimensionKey === "metric_period_months") &&
    get(filters, METRIC_PERIOD_MONTHS) &&
    !skippedFilters.includes(METRIC_PERIOD_MONTHS) &&
    !nullSafeComparison(
      item.metric_period_months,
      get(filters, METRIC_PERIOD_MONTHS)
    )
  ) {
    return false;
  }

  if (
    (dimensionKey === undefined || dimensionKey === "district") &&
    get(filters, DISTRICT) &&
    !skippedFilters.includes(DISTRICT) &&
    !(
      treatCategoryAllAsAbsent && includesAllItemFirst(get(filters, DISTRICT))
    ) &&
    !nullSafeComparisonForArray(item.district, get(filters, DISTRICT))
  ) {
    return false;
  }

  if (
    (dimensionKey === undefined ||
      dimensionKey === "level_1_supervision_location") &&
    get(filters, LEVEL_1_SUPERVISION_LOCATION) &&
    !skippedFilters.includes(LEVEL_1_SUPERVISION_LOCATION) &&
    !(
      treatCategoryAllAsAbsent &&
      includesAllItemFirst(get(filters, LEVEL_1_SUPERVISION_LOCATION))
    ) &&
    !nullSafeComparisonForArray(
      item.level_1_supervision_location,
      get(filters, LEVEL_1_SUPERVISION_LOCATION)
    )
  ) {
    return false;
  }

  if (
    (dimensionKey === undefined ||
      dimensionKey === "level_2_supervision_location") &&
    get(filters, LEVEL_2_SUPERVISION_LOCATION) &&
    !skippedFilters.includes(LEVEL_2_SUPERVISION_LOCATION) &&
    !(
      treatCategoryAllAsAbsent &&
      includesAllItemFirst(get(filters, LEVEL_2_SUPERVISION_LOCATION))
    ) &&
    !nullSafeComparisonForArray(
      item.level_2_supervision_location,
      get(filters, LEVEL_2_SUPERVISION_LOCATION)
    )
  ) {
    return false;
  }

  if (
    (dimensionKey === undefined || dimensionKey === "charge_category") &&
    get(filters, CHARGE_CATEGORY) &&
    !skippedFilters.includes(CHARGE_CATEGORY) &&
    !(treatCategoryAllAsAbsent && isAllItem(get(filters, CHARGE_CATEGORY))) &&
    !nullSafeComparison(item.charge_category, get(filters, CHARGE_CATEGORY))
  ) {
    return false;
  }
  if (
    (dimensionKey === undefined || dimensionKey === "supervision_type") &&
    get(filters, SUPERVISION_TYPE) &&
    !skippedFilters.includes(SUPERVISION_TYPE) &&
    !(treatCategoryAllAsAbsent && isAllItem(get(filters, SUPERVISION_TYPE))) &&
    !nullSafeComparison(item.supervision_type, get(filters, SUPERVISION_TYPE))
  ) {
    return false;
  }
  if (
    (dimensionKey === undefined || dimensionKey === "admission_type") &&
    get(filters, ADMISSION_TYPE) &&
    !skippedFilters.includes(ADMISSION_TYPE) &&
    !includesAllItemFirst(get(filters, ADMISSION_TYPE)) &&
    !nullSafeComparisonForArray(
      item.admission_type,
      get(filters, ADMISSION_TYPE)
    )
  ) {
    return false;
  }
  if (
    (dimensionKey === undefined || dimensionKey === "supervision_level") &&
    get(filters, SUPERVISION_LEVEL) &&
    !skippedFilters.includes(SUPERVISION_LEVEL) &&
    !nullSafeComparison(
      item.supervision_level,
      get(filters, SUPERVISION_LEVEL)
    ) &&
    !(treatCategoryAllAsAbsent && isAllItem(get(filters, SUPERVISION_LEVEL)))
  ) {
    return false;
  }
  return true;
};

export const applyTopLevelFilters = ({
  filters,
  skippedFilters = [],
  treatCategoryAllAsAbsent = false,
}) => (data) => {
  const filterFn = matchesTopLevelFilters({
    filters,
    skippedFilters,
    treatCategoryAllAsAbsent,
  });
  return data.filter((item) => filterFn(item));
};

export const matchesMatrixFilters = (filters) => (item, dimensionKey) => {
  if (
    (dimensionKey === undefined || dimensionKey === "violation_type") &&
    get(filters, VIOLATION_TYPE) &&
    !nullSafeComparison(item.violation_type, get(filters, VIOLATION_TYPE))
  ) {
    return false;
  }

  if (
    (dimensionKey === undefined || dimensionKey === "reported_violations") &&
    get(filters, REPORTED_VIOLATIONS) &&
    toInt(item.reported_violations) !== toInt(get(filters, REPORTED_VIOLATIONS))
  ) {
    return false;
  }
  return true;
};

export const applyMatrixFilters = (filters) => (data) => {
  const filterFn = matchesMatrixFilters(filters);
  return data.filter((item) => filterFn(item));
};

export const matchesAllFilters = ({
  filters,
  skippedFilters = [],
  treatCategoryAllAsAbsent = false,
}) => (item, dimensionKey = undefined) => {
  const topLevelFilterFn = matchesTopLevelFilters({
    filters,
    skippedFilters,
    treatCategoryAllAsAbsent,
  });
  const matrixFilterFn = matchesMatrixFilters(filters);
  return (
    topLevelFilterFn(item, dimensionKey) && matrixFilterFn(item, dimensionKey)
  );
};

export const applyAllFilters = ({
  filters,
  skippedFilters = [],
  treatCategoryAllAsAbsent = false,
}) => (data) => {
  const filteredData = applyTopLevelFilters({
    filters,
    skippedFilters,
    treatCategoryAllAsAbsent,
  })(data);
  return applyMatrixFilters(filters)(filteredData);
};

export const formattedMatrixFilters = (filters) => {
  const parts = [];
  if (filters[VIOLATION_TYPE]) {
    parts.push(matrixViolationTypeToLabel[filters[VIOLATION_TYPE]]);
  }
  if (filters[REPORTED_VIOLATIONS]) {
    parts.push(
      `${violationCountLabel(filters[REPORTED_VIOLATIONS])} violations`
    );
  }
  return parts.join(", ");
};

export const limitFiltersToUserDistricts = (filters, userDistricts) => {
  if (userDistricts !== null && includesAllItemFirst(filters[DISTRICT])) {
    return { ...filters, district: userDistricts };
  }

  return filters;
};
