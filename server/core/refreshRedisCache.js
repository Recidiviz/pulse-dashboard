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
const { getCacheKey } = require("../utils/getCacheKey");

function cacheEachFile({ files, stateCode, metricType, cacheKeyPrefix }) {
  const cache = getCache(cacheKeyPrefix);
  const cachePromises = [];

  Object.keys(files).forEach((file) => {
    const cacheKey = getCacheKey({ stateCode, metricType, file });
    const metricFile = { [file]: files[file] };
    console.log(`Setting cache for: ${cacheKey}...`);
    cachePromises.push(cache.set(cacheKey, metricFile));
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
