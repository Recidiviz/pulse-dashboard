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
} from "../../../constants/filterTypes";

const matchesChargeCategoryFilter = (
  item,
  filters,
  treatCategoryAllAsAbsent
) => {
  return Array.isArray(filters[CHARGE_CATEGORY])
    ? filters[CHARGE_CATEGORY].includes(item.charge_category)
    : (treatCategoryAllAsAbsent && isAllItem(filters[CHARGE_CATEGORY])) ||
        nullSafeComparison(item.charge_category, filters[CHARGE_CATEGORY]);
};

export const matchesTopLevelFilters = ({
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
    !nullSafeComparisonForArray(item.district, filters[DISTRICT])
  ) {
    return false;
  }

  if (
    (dimensionKey === undefined || dimensionKey === "charge_category") &&
    filters[CHARGE_CATEGORY] &&
    !skippedFilters.includes(CHARGE_CATEGORY) &&
    !matchesChargeCategoryFilter(item, filters, treatCategoryAllAsAbsent)
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
    !nullSafeComparisonForArray(item.admission_type, filters[ADMISSION_TYPE])
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
    filters[VIOLATION_TYPE] &&
    !nullSafeComparison(item.violation_type, filters[VIOLATION_TYPE])
  ) {
    return false;
  }

  if (
    (dimensionKey === undefined || dimensionKey === "reported_violations") &&
    filters[REPORTED_VIOLATIONS] &&
    toInt(item.reported_violations) !== toInt(filters[REPORTED_VIOLATIONS])
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
