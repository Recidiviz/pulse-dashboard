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
  ADMISSION_TYPE,
  CHARGE_CATEGORY,
  DISTRICT,
  METRIC_PERIOD_MONTHS,
  REPORTED_VIOLATIONS,
  SUPERVISION_LEVEL,
  SUPERVISION_TYPE,
  VIOLATION_TYPE,
} from "../../../constants/filterTypes";

const nullSafeComparison = (field, filter) => {
  if (!field && !filter) return true;
  if (!field) return false;
  if (!filter) return false;
  return field.toLowerCase() === filter.toLowerCase();
};

const nullSafeComparisonForArray = (field, filters) => {
  if (!field && !filters) return true;
  if (!field) return false;
  if (!filters) return false;
  return (
    filters.filter((value) => value.toLowerCase() === field.toLowerCase())
      .length !== 0
  );
};

const isAllItem = (item) => item.toLowerCase() === "all";
const includesAllItemFirst = (items) => {
  return items.length === 1 && isAllItem(items[0]);
};

export const applyTopLevelFilters = (
  filters,
  skippedFilters = [],
  treatCategoryAllAsAbsent = false
) => (data) =>
  data.filter((item) => {
    if (
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
      filters[DISTRICT] &&
      !skippedFilters.includes(DISTRICT) &&
      !(treatCategoryAllAsAbsent && includesAllItemFirst(filters[DISTRICT])) &&
      !nullSafeComparisonForArray(item.district, filters[DISTRICT])
    ) {
      return false;
    }

    if (
      filters[CHARGE_CATEGORY] &&
      !skippedFilters.includes(CHARGE_CATEGORY) &&
      !(treatCategoryAllAsAbsent && isAllItem(filters[CHARGE_CATEGORY])) &&
      !nullSafeComparison(item.charge_category, filters[CHARGE_CATEGORY])
    ) {
      return false;
    }
    if (
      filters[SUPERVISION_TYPE] &&
      !skippedFilters.includes(SUPERVISION_TYPE) &&
      !(treatCategoryAllAsAbsent && isAllItem(filters[SUPERVISION_TYPE])) &&
      !nullSafeComparison(item.supervision_type, filters[SUPERVISION_TYPE])
    ) {
      return false;
    }
    if (
      filters[ADMISSION_TYPE] &&
      !skippedFilters.includes(ADMISSION_TYPE) &&
      !includesAllItemFirst(filters[ADMISSION_TYPE]) &&
      !nullSafeComparisonForArray(item.admission_type, filters[ADMISSION_TYPE])
    ) {
      return false;
    }
    if (
      filters[SUPERVISION_LEVEL] &&
      !skippedFilters.includes(SUPERVISION_LEVEL) &&
      !nullSafeComparison(item.supervision_level, filters[SUPERVISION_LEVEL]) &&
      !(treatCategoryAllAsAbsent && isAllItem(filters[SUPERVISION_LEVEL]))
    ) {
      return false;
    }
    return true;
  });

export const applyMatrixFilters = (filters) => (data) =>
  data.filter((item) => {
    if (
      filters[VIOLATION_TYPE] &&
      !nullSafeComparison(item.violation_type, filters[VIOLATION_TYPE])
    ) {
      return false;
    }

    if (
      filters[REPORTED_VIOLATIONS] &&
      toInt(item.reported_violations) !== toInt(filters[REPORTED_VIOLATIONS])
    ) {
      return false;
    }
    return true;
  });

export const applyAllFilters = (
  filters,
  skippedFilters = [],
  treatCategoryAllAsAbsent = false
) => (data) => {
  const filteredData = applyTopLevelFilters(
    filters,
    skippedFilters,
    treatCategoryAllAsAbsent
  )(data);
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
