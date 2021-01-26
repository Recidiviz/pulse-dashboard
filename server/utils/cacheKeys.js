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
const {
  getSubsetManifest,
  FILES_WITH_SUBSETS,
} = require("../constants/subsetManifest");

/**
 *
 * @param {string[][]} collection - A nested array of strings, [["dimensionKeyA=0"], ["dimensionKeyB=0", "dimensionKeyB=1"]]
 * @param {number} max - The max number of items to include in each combination.
 *
 * @returns {string[][]} - A nested array of all the combinations. [["dimensionKeyA=0", "dimensionKeyB=0"], ["dimensionKeyA=0", "dimensionKeyB=1"]]
 */
function getCombinations(collection, max = 0) {
  const combinations = [];

  function createCombination(start = 0, previousResults = []) {
    for (let i = start; i < collection.length; i += 1) {
      for (let j = 0; j < collection[i].length; j += 1) {
        const item = collection[i][j];
        const currentResults = previousResults.concat(item);
        if (currentResults.length === max) {
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
 * Utility for generating an array of subset keys from a provided subset manifest.
 * This is used to create combinations for all the subset keys.
 * @param {string[][]} subsetManifest - A nested array of dimension keys and subsets. For example, [["dimensionKey", [["subset_1"], ["subset_2"]]]
 *
 * @returns {string[][]} - Returns a nested array of strings formatted as "dimensionKey=subsetIndex" for each dimension key's subset array.
 *                         Example: [["dimensionKey=0", "dimensionKey=1"]]
 */
function getAllSubsetKeyStrings(subsetManifest) {
  const subsetKeys = [];

  subsetManifest.forEach(([dimensionKey, subsets], index) => {
    for (let i = 0; i < subsets.length; i += 1) {
      if (!Array.isArray(subsetKeys[index])) {
        subsetKeys[index] = [];
      }
      subsetKeys[index].push(`${dimensionKey}=${i}`);
    }
  });
  return subsetKeys;
}

/**
 * Utility for generating an array all subset cache key combinations
 * @param {string[][]} subsetManifest - A nested array of dimension keys and subsets. For example, [["dimensionKey", [["subset_1"], ["subset_2"]]]
 *
 * @returns {string[]} - Returns an array of strings formatted as "dimensionKeyA=subsetIndex-dimensionKeyB=subsetIndex" for each dimension key
 * and subset index defined in the subsetManifest.
 */
function getSubsetCacheKeyCombinations(subsetManifest) {
  const subsetKeys = getAllSubsetKeyStrings(subsetManifest);
  const combinations = getCombinations(subsetKeys, subsetKeys.length);
  return combinations.map((subsets) => subsets.join("-"));
}

/**
 * Utility for creating cache keys for a stateCode, metricType, file and subset
 * @param {string} [stateCode] - The state code to include in the cache key, i.e. US_MO
 * @param {string} [metricType] - The metric type to include in the cache key, i.e. newRevocation
 * @param {string} [file] - The file name to include in the cache key without an extension, i.e. revocations_matrix_by_month
 * @param {Object} [cacheKeySubset] - The subset keys to include in the cache key, these come from the endpoint query params
 * @param {string} [cacheKeySubset.violationType] - The violation type to use to select the correct subset
 * @param {string} [cacheKeyPrefix] - A cacheKey to use for the prefix that includes the stateCode and metricType, i.e. US_MO-newRevocation
 *
 * @returns {string} - Returns a cache key string. Example: US_MO-newRevocation-revocations_matrix_distribution_by_district-violationType=0
 */
function getCacheKey({
  stateCode,
  metricType,
  file,
  cacheKeySubset,
  cacheKeyPrefix = null,
}) {
  if (!stateCode && !metricType && !cacheKeyPrefix) {
    throw new Error(
      "Missing required parameters to generate cache key: stateCode, metricType"
    );
  }
  let cacheKey = cacheKeyPrefix || `${stateCode.toUpperCase()}-${metricType}`;

  if (file) {
    cacheKey = `${cacheKey}-${file}`;
  }

  if (!cacheKeySubset || !FILES_WITH_SUBSETS.includes(file)) {
    return cacheKey;
  }

  getSubsetManifest().forEach(([dimensionKey, dimensionSubsets]) => {
    const subsetValue = cacheKeySubset[dimensionKey];
    const subsetIndex = dimensionSubsets.findIndex(
      (subset) => subsetValue && subset.includes(subsetValue)
    );
    if (subsetValue && subsetIndex >= 0) {
      cacheKey = `${cacheKey}-${dimensionKey}=${subsetIndex}`;
    }
  });

  return cacheKey;
}

module.exports = { getCacheKey, getSubsetCacheKeyCombinations };
