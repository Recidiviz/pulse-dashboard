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
const { matchesAllFilters } = require("shared-filters");
const {
  getSubsetDimensionKeys,
  getSubsetDimensionValues,
} = require("./subsetFileHelpers");

/**
 * Transform a filter's value to include all values in the subset manifest. Only returns filter dimensions that are
 * in the subset manifest.
 *
 * @param {Object} filters - Filter key/value pairs, Ex: { violation_type: "all", charge_category: "general" }
 * The values may also be indices referring to the set of values from the subset manifest, for example: { violation_type: 0 }.
 *
 * @returns {Object} - An object with each filter key and all possible values from the subset dimension
 * Example: { violation_type: ["felony", "law", "misdemeanor"], charge_category: ["sex_offense"] }
 */
function createSubsetFilters({ filters }) {
  const subsetFilters = {};
  const subsetDimensionKeys = getSubsetDimensionKeys();

  Object.keys(filters).forEach((filterKey) => {
    const formattedKey = snakeCase(filterKey);
    if (subsetDimensionKeys.includes(formattedKey)) {
      subsetFilters[formattedKey] = getSubsetDimensionValues(
        formattedKey,
        filters[filterKey]
      );
    }
  });
  return subsetFilters;
}

/**
 * Get the filtering function to use by metric file name
 *
 * @param {String} file
 * @param {Object} subsetFilters - Filters with all the dimension values from the subset manifest
 *
 * @returns {(item: object, dimensionKey: string) => boolean} - A filter that takes each datapoint and dimension key
 * and returns whether or not the item should be filtered out.
 */
const getFilterFnByFile = (file, subsetFilters) => {
  switch (file) {
    case "revocations_matrix_distribution_by_district":
    case "revocations_matrix_distribution_by_risk_level":
    case "revocations_matrix_distribution_by_gender":
    case "revocations_matrix_distribution_by_officer":
    case "revocations_matrix_distribution_by_race":
    case "revocations_matrix_distribution_by_violation":
      return matchesAllFilters({
        filters: subsetFilters,
      });
    default:
      return () => true;
  }
};

module.exports = { getFilterFnByFile, createSubsetFilters };
