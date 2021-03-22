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

const { snakeCase } = require("lodash");
const { matchesAllFilters, getFilterKeys } = require("shared-filters");

const {
  getSubsetDimensionKeys,
  getSubsetDimensionValues,
} = require("./subsetFileHelpers");

/**
 * Transform a filter's value to include all values in the subset manifest for each filter key.
 * Only returns filter dimensions that are in the subset manifest for FILES_WITH_SUBSETS.
 *
 * The level_1_supervision_location filter dimension is added to the filters for most files
 * based on the logic in getFiltersByMetricName if restrictedDistrict filter key exists.
 *
 * @param {Object} filters - Filter key/value pairs, Ex: { violation_type: "all", charge_category: "general" }
 * The values may also be indices referring to the set of values from the subset manifest, for example: { violation_type: 0 }.
 *
 * @param {string} metricName - Name of the metric file
 *
 * @returns {Object} - An object with each filter key and all possible values from the subset dimension
 * Example: { violation_type: ["felony", "law", "misdemeanor"], charge_category: ["sex_offense"], level_1_supervision_location: ["03"] }
 */
function createSubsetFilters({ filters, metricName }) {
  const subsetDimensionKeys = getSubsetDimensionKeys();
  const { restrictedDistrict } = filters;
  const subsetFilters = {};

  Object.keys(filters).forEach((filterKey) => {
    const formattedKey = snakeCase(filterKey);
    if (subsetDimensionKeys.includes(formattedKey)) {
      subsetFilters[formattedKey] = getSubsetDimensionValues(
        formattedKey,
        filters[filterKey]
      );
    }
  });

  const transformedFilters = transformRestrictedDistrictFilter(
    restrictedDistrict,
    subsetFilters
  );

  return getFiltersByMetricName(metricName, transformedFilters);
}

/**
 * @param  {Object} restrictedDisrict - Object with restrictedDistrict key and filter value
 *
 * @param  {Object} subsetFilters - Object containing subsetFilters
 *
 * @returns {Object} - An object with the restrictedDistrict filter key renamed
 * to level_1_supervision_location if it exists.
 */
const transformRestrictedDistrictFilter = (
  restrictedDistrict,
  subsetFilters
) => {
  return restrictedDistrict
    ? {
        ...subsetFilters,
        ...{ level_1_supervision_location: restrictedDistrict },
      }
    : subsetFilters;
};

/**
 * Get the filtering function to use by metric file name

 *
 * @param {String} metricName
 * @param {Object} filters - Filters with all the dimension values from the subset manifest
 *
 * @returns {(item: object, dimensionKey: string) => boolean} - A filter that takes each datapoint and dimension key
 * and returns whether or not the item should be filtered out.
 */
const getFilterFnByMetricName = (metricName, filters) => {
  const filterKeys = getFilterKeys();

  return metricName === "revocations_matrix_by_month"
    ? matchesAllFilters({
        filters,
        skippedFilters: [filterKeys.METRIC_PERIOD_MONTHS],
      })
    : matchesAllFilters({ filters });
};

/**
 * Get the filters to use by metric file name
 *
 * @param {String} metricName
 * @param {Object} filters - Filters with all the dimension values from the subset manifest
 *
 * @returns {(item: object, dimensionKey: string) => boolean} - An object with the filter keys that should be used
 * when creating the subset for each metric file
 */
const getFiltersByMetricName = (metricName, filters) => {
  const {
    // eslint-disable-next-line camelcase
    level_1_supervision_location,
    ...filtersWithoutLevelOneSupervisionLocation
  } = filters;

  switch (metricName) {
    case "revocations_matrix_distribution_by_risk_level":
    case "revocations_matrix_distribution_by_gender":
    case "revocations_matrix_distribution_by_officer":
    case "revocations_matrix_distribution_by_race":
    case "revocations_matrix_distribution_by_violation":
    case "revocations_matrix_by_month":
      return filters;
    // Only create a subset when there is a restricted district (level_1_supervision_location)
    case "revocations_matrix_cells":
    case "revocations_matrix_filtered_caseload":
      return { level_1_supervision_location };
    // Do not filter the districts by the restricted district (level_1_supervision_location)
    case "revocations_matrix_distribution_by_district":
      return filtersWithoutLevelOneSupervisionLocation;
    default:
      return { level_1_supervision_location };
  }
};

module.exports = {
  getFilterFnByMetricName,
  getFiltersByMetricName,
  createSubsetFilters,
};
