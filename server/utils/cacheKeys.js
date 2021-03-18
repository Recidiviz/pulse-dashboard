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
const { camelCase } = require("lodash");
const {
  getSubsetManifest,
  FILES_WITH_SUBSETS,
} = require("../constants/subsetManifest");

/**
 * Returns the cache key suffix for the given subset combination.
 * @param {Object} subsetCombination - A subset filter combination, { dimension_a: 0, dimension_b: 1 }
 * @returns {string} The cache key suffix, example: "dimension_a=0-dimension_b=1"
 */
function getCacheKeyForSubsetCombination(subsetCombination) {
  return Object.entries(subsetCombination)
    .map((subsetDimension) => subsetDimension.join("="))
    .join("-");
}

/**
 * Given a nested array of all dimension key/value pairs, returns all possible combinations as an array of objects.
 *
 * @param {Object[][]} collection - A nested array of all possible dimension key/value pairs, [{dimension_a: 0, dimension_a: 1}, {dimension_b: 0, dimension_b: 1}]
 * @param {number} max - The max number of items to include in each combination.
 *
 * @returns {Object[][]} - A nested array of all the combinations. [{dimension_a: 0, dimension_b: 0}, {dimension_a: 0, dimension_b: 1},
 */
function getAllSubsetCombinations(collection, max = 0) {
  const combinations = [];

  function createCombination(start = 0, previousResults = {}) {
    for (let i = start; i < collection.length; i += 1) {
      for (let j = 0; j < collection[i].length; j += 1) {
        const item = collection[i][j];
        const currentResults = {
          ...item,
          ...previousResults,
        };
        if (Object.keys(currentResults).length === max) {
          combinations.push(currentResults);
        }
        createCombination(i + 1, currentResults);
      }
    }
  }
  createCombination();
  return combinations;
}

/**
 * Creates a nested array of all dimension key/value pairs
 *
 * @param {Array[][]} subsetManifest
 * @returns {Object[][]} - A nested array of all dimension key/value pairs
 * [[{dimension_a: 0}, {dimension_a: 1}], [{dimension_b: 0}, {dimension_b: 1}]]
 */
function getAllSubsetKeyValues(subsetManifest) {
  const subsetKeyValues = [];

  subsetManifest.forEach(([dimensionKey, subsets], index) => {
    for (let i = 0; i < subsets.length; i += 1) {
      if (!Array.isArray(subsetKeyValues[index])) {
        subsetKeyValues[index] = [];
      }
      subsetKeyValues[index].push({ [dimensionKey]: i });
    }
  });
  return subsetKeyValues;
}

/**
 * Generates an array of all subset filter combinations
 * @param {string[][]} subsetManifest - A nested array of dimension keys and subsets.
 *                     [["dimension_a", [["subset_1"], ["subset_2"]],
 *                      ["dimension_b", [["subset_1"], ["subset_2"]]]]
 *
 * @returns {Object[]} - Returns an array of subset filters.
 *                     [{ dimension_a: 0, dimension_b: 0 },
 *                      { dimension_a: 0, dimension_b: 1 }]
 */
function getSubsetCombinations(subsetManifest) {
  const subsetKeyValues = getAllSubsetKeyValues(subsetManifest);
  return getAllSubsetCombinations(subsetKeyValues, subsetKeyValues.length);
}

/**
 * Utility for creating cache keys for a stateCode, metricType, file and subset
 * @param {string} [stateCode] - The state code to include in the cache key, i.e. US_MO
 * @param {string} [metricType] - The metric type to include in the cache key, i.e. newRevocation
 * @param {string} [metricName] - The metric name to include in the cache key without an extension, i.e. revocations_matrix_by_month
 * @param {Object} [cacheKeySubset] - The subset keys to include in the cache key, these come from the endpoint query params
 * @param {string} [cacheKeySubset.violationType] - The violation type to use to select the correct subset
 * @param {string} [cacheKeyPrefix] - A cacheKey to use for the prefix that includes the stateCode and metricType, i.e. US_MO-newRevocation
 *
 * @returns {string} - Returns a cache key string. Example: US_MO-newRevocation-revocations_matrix_distribution_by_district-violationType=0
 */
function getCacheKey({
  stateCode,
  metricType,
  metricName,
  cacheKeySubset,
  cacheKeyPrefix = null,
}) {
  if (!stateCode && !metricType && !cacheKeyPrefix) {
    throw new Error(
      "Missing required parameters to generate cache key: stateCode, metricType"
    );
  }
  let cacheKey = cacheKeyPrefix || `${stateCode.toUpperCase()}-${metricType}`;

  if (metricName) {
    cacheKey = `${cacheKey}-${metricName}`;
  }

  const { restrictedDistrict } = cacheKeySubset;

  if (cacheKeySubset && FILES_WITH_SUBSETS.includes(metricName)) {
    getSubsetManifest().forEach(([dimensionKey, dimensionSubsets]) => {
      const subsetValue = cacheKeySubset[camelCase(dimensionKey)];
      const subsetIndex = dimensionSubsets.findIndex(
        (subset) => subsetValue && subset.includes(subsetValue)
      );
      if (subsetValue && subsetIndex >= 0) {
        cacheKey = `${cacheKey}-${dimensionKey}=${subsetIndex}`;
      }
    });
  }

  return appendRestrictedDistrictKey(cacheKey, restrictedDistrict);
}

const appendRestrictedDistrictKey = (cacheKey, restrictedDistrict) => {
  return restrictedDistrict
    ? `${cacheKey}-restrictedDistrict=${restrictedDistrict}`
    : cacheKey;
};

module.exports = {
  getCacheKey,
  getCacheKeyForSubsetCombination,
  getSubsetCombinations,
};
