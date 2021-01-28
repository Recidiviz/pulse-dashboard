const { snakeCase } = require("lodash");
const { matchesAllFilters, getFilterKeys } = require("shared-filters");
const {
  getSubsetDimensionKeys,
  getSubsetDimensionValues,
} = require("./subsetFileHelpers");

const { DISTRICT } = getFilterKeys();

function transformFilters(filters) {
  const transformedFilters = {};
  const subsetDimensionKeys = getSubsetDimensionKeys();

  Object.keys(filters).forEach((filterKey) => {
    const formattedKey = snakeCase(filterKey);
    if (subsetDimensionKeys.includes(formattedKey)) {
      transformedFilters[formattedKey] = getSubsetDimensionValues(
        formattedKey,
        filters[filterKey]
      );
    }
  });
  return transformedFilters;
}

const getFilterFnByFile = (file, filters) => {
  switch (file) {
    case "revocations_matrix_distribution_by_district":
    case "revocations_matrix_distribution_by_risk_level":
    case "revocations_matrix_distribution_by_gender":
    case "revocations_matrix_distribution_by_officer":
    case "revocations_matrix_distribution_by_race":
    case "revocations_matrix_distribution_by_violation":
      return matchesAllFilters({
        filters,
        skippedFilters: [
          file === "revocations_matrix_distribution_by_district" && DISTRICT,
        ],
      });
    default:
      return () => true;
  }
};

module.exports = { getFilterFnByFile, transformFilters };
