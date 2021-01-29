const { snakeCase } = require("lodash");
const { matchesAllFilters, getFilterKeys } = require("shared-filters");
const {
  getSubsetDimensionKeys,
  getSubsetDimensionValues,
} = require("./subsetFileHelpers");

const { DISTRICT } = getFilterKeys();

/**
 * Transform a filter's value to include all values in the subset manifest.
 *
 * @param {Object} filters - Filter key/value pairs, Ex: { violation_type: "all", charge_category: "general" }
 * @param {boolean} useIndexValue - Whether to access the subset values by index instead of by value.
 * This is used when the filter's value is already transformed to the dimension's value index. In this case,
 * the filters param should have the index of the dimension value as its value, for example:
 * { violation_type: 0, charge_category: 1 }
 *
 * @returns {Object} - An object with each filter key and all possible values from the subset dimension
 * Example: { violation_type: ["felony", "law", "misdemeanor"], charge_category: ["sex_offense"] }
 */
function transformFilters({ filters, useIndexValue = false }) {
  const transformedFilters = {};
  const subsetDimensionKeys = getSubsetDimensionKeys();

  Object.keys(filters).forEach((filterKey) => {
    const formattedKey = snakeCase(filterKey);
    if (subsetDimensionKeys.includes(formattedKey)) {
      transformedFilters[formattedKey] = getSubsetDimensionValues(
        formattedKey,
        filters[filterKey],
        useIndexValue
      );
    }
  });
  return transformedFilters;
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
        skippedFilters: [
          file === "revocations_matrix_distribution_by_district" && DISTRICT,
        ],
      });
    default:
      return () => true;
  }
};

module.exports = { getFilterFnByFile, transformFilters };
