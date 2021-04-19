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

import qs from "qs";

/**
 *
 * @param {Object} filters - The filter values used to construct the query string to request metric data
 * @param {string} filters.chargeCategory - A charge category or "All"
 * @param {Array} filters.district - District IDs or "All"
 * @param {Array} filters.levelOneSupervisionLocation - level_1_supervision_location IDs or "All"
 * @param {Array} filters.levelTwoSupervisionLocation - level_2_supervision_location IDs or "All"
 * @param {string} filters.metricPeriodMonths - The number of months in the time period
 * @param {string} filters.supervisionType - Supervision Type or "All"
 * @param {string} filters.supervisionLevel - Supervision level or "All"
 * @param {string} filters.reportedViolations - Number of reported violations or "All"
 * @param {string} filters.violationType - Violation type
 * @param {string} filters.admissionType - Admission types or "All"
 */
export function getQueryStringFromFilters(filters = {}, restrictedDistrict) {
  return qs.stringify(
    { ...filters, restrictedDistrict },
    {
      encode: false,
      addQueryPrefix: true,
      filter: (_, value) => (value !== "" ? value : undefined),
    }
  );
}

export function dimensionManifestIncludesFilterValues({
  filters,
  dimensionManifest,
  ignoredSubsetDimensions = [],
  skippedFilters = [],
  treatCategoryAllAsAbsent = false,
}) {
  if (!filters || !dimensionManifest) return false;
  return Object.keys(filters).every((filterType) => {
    if (
      skippedFilters.includes(filterType) ||
      ignoredSubsetDimensions.includes(filterType) ||
      // This is for the CaseTable
      (filters[filterType].toLowerCase() === "all" && treatCategoryAllAsAbsent)
    ) {
      return true;
    }
    if (dimensionManifest[filterType] === undefined) {
      // This should only occur with the JSON metric data (never in production).
      // When fetching optimized data, this logic branch should not be possible
      console.error(
        `Expected to find ${filterType} in the dimension manifest. Should this filter be skipped?`
      );
      return true;
    }
    return dimensionManifest[filterType].includes(
      filters[filterType].toLowerCase()
    );
  });
}
