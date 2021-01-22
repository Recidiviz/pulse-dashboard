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
const { getSubsetCacheKeyCombinations } = require("../utils/cacheKeys");
const {
  SUBSET_MANIFEST,
  FILES_WITH_SUBSETS,
} = require("../constants/subsetManifest");

const allSubsetCacheKeys = getSubsetCacheKeyCombinations(SUBSET_MANIFEST);

function cacheEachSubsetFile(cache, cacheKey, metricFile) {
  const cachePromises = [];
  allSubsetCacheKeys.forEach((subsetKey) => {
    const cacheKeyWithSubset = `${cacheKey}-${subsetKey}`;
    console.log(`Setting cache for: ${cacheKeyWithSubset}...`);
    cachePromises.push(cache.set(cacheKeyWithSubset, metricFile));
  });
  return cachePromises;
}

function cacheEachFile({ files, cacheKeyPrefix }) {
  const cache = getCache(cacheKeyPrefix);
  const cachePromises = [];

  Object.keys(files).forEach((file) => {
    const cacheKey = `${cacheKeyPrefix}-${file}`;
    const metricFile = { [file]: files[file] };

    if (FILES_WITH_SUBSETS.includes(file)) {
      // TODO: Remove line 57 once the front end is ready to receive the subset files.
      // This is the "original" cacheKey that will continue to return the full file
      // until both the FE and BE are ready to work with split files.
      cachePromises.push(cache.set(cacheKey, metricFile));
      // Cache the file with all of the subset cache keys
      cachePromises.concat(cacheEachSubsetFile(cache, cacheKey, metricFile));
    } else {
      console.log(`Setting cache for: ${cacheKey}...`);
      cachePromises.push(cache.set(cacheKey, metricFile));
    }
  });

  return cachePromises;
}

function refreshRedisCache(fetchMetrics, stateCode, metricType, callback) {
  const cacheKeyPrefix = `${stateCode.toUpperCase()}-${metricType}`;
  console.log(`Handling call to refresh cache for ${cacheKeyPrefix}...`);

  let responseError = null;

  fetchMetrics()
    .then((files) => {
      return Promise.all(
        cacheEachFile({ files, stateCode, metricType, cacheKeyPrefix })
      );
    })
    .catch((error) => {
      console.error(
        `Error occurred while caching files for metricType: ${metricType}`,
        error
      );
      responseError = error;
    })
    .finally(() => {
      callback(responseError, "OK");
    });
}

exports.default = refreshRedisCache;
