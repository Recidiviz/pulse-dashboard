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
const Sentry = require("@sentry/node");

/**
 * Refresh all of the datasets returned from the provided fetch function in the redis cache.
 * The cache key for each dataset follows the pattern: stateCode-metricType-fileName.
 *
 * The callback should be a function with a signature of `function (error, results)`. When one of the
 * set cache promises fail, they all fail and an error is sent to the server response.
 *
 */

/* eslint-disable no-console */
const { getCache } = require("./cacheManager");
const { createSubset, createSubsetFilters } = require("../filters");
const {
  getSubsetCombinations,
  getCacheKeyForSubsetCombination,
} = require("../utils/cacheKeys");
const {
  getSubsetManifest,
  FILES_WITH_SUBSETS,
} = require("../constants/subsetManifest");

function cacheEachSubsetFile(
  cache,
  cacheKey,
  fileKey,
  metricFile,
  subsetCombinations
) {
  const cachePromises = [];
  subsetCombinations.forEach((subsetCombination) => {
    const subsetCacheKey = `${cacheKey}-${getCacheKeyForSubsetCombination(
      subsetCombination
    )}`;
    const subsetFilters = createSubsetFilters({
      filters: subsetCombination,
    });
    const subsetFile = createSubset(fileKey, subsetFilters, metricFile);

    console.log(`Setting subset cache for: ${subsetCacheKey}...`);

    cachePromises.push(cache.set(subsetCacheKey, subsetFile));
  });
  return cachePromises;
}

function cacheFiles({ files, cacheKeyPrefix }) {
  const cache = getCache(cacheKeyPrefix);
  const cachePromises = [];
  const subsetCombinations = getSubsetCombinations(getSubsetManifest());

  Object.keys(files).forEach((fileKey) => {
    const cacheKey = `${cacheKeyPrefix}-${fileKey}`;
    const metricFile = { [fileKey]: files[fileKey] };

    if (FILES_WITH_SUBSETS.includes(fileKey)) {
      const subsetCachePromises = cacheEachSubsetFile(
        cache,
        cacheKey,
        fileKey,
        metricFile,
        subsetCombinations
      );
      cachePromises.push(...subsetCachePromises);
    } else {
      console.log(`Setting cache for: ${cacheKey}...`);
      cachePromises.push(cache.set(cacheKey, metricFile));
    }
  });
  console.log(
    `Waiting for ${cachePromises.length} cache promises to resolve for ${cacheKeyPrefix}...`
  );
  return cachePromises;
}

function refreshRedisCache(fetchMetrics, stateCode, metricType, callback) {
  const cacheKeyPrefix = `${stateCode.toUpperCase()}-${metricType}`;
  console.log(`Handling call to refresh cache for ${cacheKeyPrefix}...`);

  let responseError = null;

  return fetchMetrics()
    .then((files) => {
      return Promise.all(
        cacheFiles({ files, stateCode, metricType, cacheKeyPrefix })
      );
    })
    .catch((error) => {
      const message = `Error occurred while caching files for metricType: ${metricType}`;
      console.error(message, error);
      responseError = error;
      Sentry.captureException(message, responseError);
    })
    .finally(() => {
      callback(responseError, "OK");
    });
}

exports.default = refreshRedisCache;
