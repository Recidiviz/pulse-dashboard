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
/* eslint-disable camelcase */
const { matchesAllFilters, getFilterKeys } = require("shared-filters");
const {
  getSubsetDimensionKeys,
  getSubsetDimensionValues,
} = require("./subsetFileHelpers");

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

  return metricName === "revocations_matrix_events_by_month"
    ? matchesAllFilters({
        filters,
        skippedFilters: [filterKeys.METRIC_PERIOD_MONTHS],
      })
    : matchesAllFilters({ filters });
};

/**
 * Get the filters to use by metric file name
 *
 * @param {String} metricName - Name of the metric file to filter
 * @param {Object} subsetFilters - Subset filters to apply from the subset manifest
 * @param {Object} userRestrictionsFilters - User restrictions to apply if they exist
 *
 * @returns {(item: object, dimensionKey: string) => boolean} - An object with
 * the filter keys that should be used when filter each metric file by the subset
 * manifest or user restrictions.
 */
const getNewRevocationsFiltersByMetricName = ({
  metricName,
  subsetFilters,
  userRestrictionsFilters,
}) => {
  switch (metricName) {
    case "revocations_matrix_distribution_by_district":
      return subsetFilters;
    case "revocations_matrix_distribution_by_risk_level":
    case "revocations_matrix_distribution_by_gender":
    case "revocations_matrix_distribution_by_officer":
    case "revocations_matrix_distribution_by_race":
    case "revocations_matrix_distribution_by_violation":
    case "revocations_matrix_events_by_month":
      return { ...subsetFilters, ...userRestrictionsFilters };
    case "revocations_matrix_cells":
    case "revocations_matrix_filtered_caseload":
      return userRestrictionsFilters;
    default:
      return {};
  }
};

/**
 * Transform a filter's value to include all values in the subset manifest for each filter key.
 * Only returns filter dimensions that are in the subset manifest for FILES_WITH_SUBSETS.
 *
 * @param {Object} filters - Filter key/value pairs, Ex: { violation_type: "all", charge_category: "general" }
 * The values may also be indices referring to the set of values from the subset manifest, for example: { violation_type: 0 }.
 *
 * @param {string} metricName - Name of the metric file
 *
 * @returns {Object} - An object with each filter key and all possible values from the subset dimension
 * Example: { violation_type: ["felony", "law", "misdemeanor"], charge_category: ["sex_offense"] }
 */
function createSubsetFilters({ filters }) {
  const subsetDimensionKeys = getSubsetDimensionKeys();
  const subsetFilters = {};

  Object.keys(filters).forEach((filterKey) => {
    if (subsetDimensionKeys.includes(filterKey)) {
      subsetFilters[filterKey] = getSubsetDimensionValues(
        filterKey,
        filters[filterKey]
      );
    }
  });

  return subsetFilters;
}

/**
 * Returns the user restrictions filters if they exist, otherwise returns an
 * empty object.
 *
 * @param  {String[]} allowedSupervisionLocationIds - Array of supervision
 * location ids to filter by, i.e. ["25", "EP"]
 *
 * @param  {String} allowedSupervisionLocationLevel - The supervision location
 * id field to filter on, i.e. level_1_supervision_location
 *
 * @returns {Object} - An object with the supervision location filter key
 * and value if they exist: { level_1_superivision_location: ["08N"] }
 */
const createUserRestrictionsFilters = (appMetadata) => {
  if (!appMetadata) return {};

  const {
    allowed_supervision_location_ids: allowedSupervisionLocationIds,
    allowed_supervision_location_level: allowedSupervisionLocationLevel,
  } = appMetadata;

  const userHasNoRestrictions =
    !allowedSupervisionLocationLevel ||
    !allowedSupervisionLocationIds ||
    !allowedSupervisionLocationIds.length > 0;

  if (userHasNoRestrictions) return {};

  return {
    [allowedSupervisionLocationLevel]: allowedSupervisionLocationIds.map((d) =>
      d.toLowerCase()
    ),
  };
};

module.exports = {
  getFilterFnByMetricName,
  getNewRevocationsFiltersByMetricName,
  createSubsetFilters,
  createUserRestrictionsFilters,
};
