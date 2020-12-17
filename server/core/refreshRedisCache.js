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
 * Retrieves the metrics for a given state code and metric type and stores each dataset in that metric type
 * in a redis cache. The cache key for each file follows the pattern: stateCode-metricType-fileName-date
 *
 * The callback should be a function with a signature of `function (error, results)`.
 */

/* eslint-disable no-console */
const { redisCache } = require("./redisCache");

function cacheEachFile(files, cacheKeyPrefix) {
  const cachingErrors = [];

  Object.keys(files).forEach((fileKey) => {
    const cacheKey = `${cacheKeyPrefix}-${fileKey}`;
    const metricFile = files[fileKey];
    redisCache
      .get(cacheKey)
      .then((cachedFile) => {
        // Update the cache if it exists and is out of date, or if it does not exist at all.
        // Skip if it exists and is not out of date.
        if (cachedFile) {
          if (metricFile.metadata.updated !== cachedFile.metadata.updated) {
            console.log(`Setting cache for: ${cacheKey}...`);
            redisCache.set(cacheKey, metricFile);
          }
        } else {
          redisCache.set(cacheKey, metricFile);
        }
      })
      .catch((error) => {
        console.error(
          `Error occurred while refreshing cache for key: ${cacheKey}`,
          error
        );
        cachingErrors.push(error);
      });
  });
  return { errors: cachingErrors.length > 0 ? cachingErrors : null };
}

function refreshRedisCache(fetchMetrics, stateCode, metricType, callback) {
  const cacheKeyPrefix = `${stateCode}-${metricType}`;
  console.log(`Handling call to refresh cache for ${cacheKeyPrefix}...`);

  let response = {};

  fetchMetrics()
    .then((results) => {
      response = cacheEachFile(results, cacheKeyPrefix);
    })
    .catch((error) => {
      console.error(
        `Error occurred while caching files for metricType: ${metricType}`,
        error
      );
      response.errors = [error];
    });

  callback(response.errors, "OK");
}

exports.default = refreshRedisCache;
