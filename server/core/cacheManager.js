// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2019 Recidiviz, Inc.
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
 * Creates the redis and memory caching managers and the redis client and
 * provides the helper function `cacheResponse` which takes an argument to determine which caching service to use.
 *
 * The function `cacheResponse`  wraps fetches and caches the values returned.
 * The `wrap` helper from cache-manager first checks the cache to see if the metrics with the given key
 * are already in cache. If it is not in cache, it calls the fetch function and invokes the callback only
 * once all files have been retrieved and cached.
 *
 * The callback should be a function with a signature of `function (error, results)`.
 *
 */
const cacheManager = require("cache-manager");
const redisStore = require("cache-manager-ioredis");
const Redis = require("ioredis");
const { default: isDemoMode } = require("../utils/isDemoMode");

const REDISHOST = process.env.REDISHOST || "localhost";
const REDISPORT = process.env.REDISPORT || 6379;
const REDISAUTH = process.env.REDISAUTH || "";

// Expire items in the redis cache after 1 day
const REDIS_CACHE_TTL_SECONDS = 60 * 60 * 24;
const REDIS_CACHE_REFRESH_THRESHOLD = 60 * 60;

// Expire items in the memory cache after 1 hour
const MEMORY_CACHE_TTL_SECONDS = 60 * 60;
const MEMORY_REFRESH_SECONDS = 60 * 10;

const testEnv = process.env.NODE_ENV === "test";

const redisInstance = new Redis({
  host: REDISHOST,
  port: REDISPORT,
  password: REDISAUTH,
  ttl: REDIS_CACHE_TTL_SECONDS,
  db: 0,
});

const memoryCache = cacheManager.caching({
  store: isDemoMode ? "none" : "memory",
  ttl: MEMORY_CACHE_TTL_SECONDS,
  refreshThreshold: MEMORY_REFRESH_SECONDS,
});

const redisCache = cacheManager.caching({
  store: redisStore,
  refreshThreshold: REDIS_CACHE_REFRESH_THRESHOLD,
  redisInstance,
});

if (!testEnv) {
  const redisClient = redisCache.store.getClient();
  redisClient.on("error", (error) => {
    console.error("ERR:REDIS:", error);
  });
}

function getCache(cacheKey) {
  if (testEnv || isDemoMode) {
    return memoryCache;
  }

  if (cacheKey.includes("-newRevocation")) {
    return redisCache;
  }

  return memoryCache;
}

function clearMemoryCache() {
  memoryCache.reset();
}

function cacheResponse(cacheKey, fetchValue, callback, processResponseFn) {
  const cache = Array.isArray(cacheKey)
    ? getCache(cacheKey[0])
    : getCache(cacheKey);
  let cacheKeyOriginal = cacheKey;

  // cacheKey will be an array for the `newRevocationFile` endpoint until we finish implementing the subset cache values.
  // If cacheKey is an array, then the first element will be the original cacheKey and the second element is the subset cache key.
  // Example: cacheKey = [cacheKeyOriginal, cacheKeySubset]
  if (Array.isArray(cacheKey)) {
    // Set the subset cache key and assign the cacheKeyOriginal value for the API response.
    cache.wrap(cacheKey[1], fetchValue);
    [cacheKeyOriginal] = cacheKey;
  }
  // TODO: For now we are always going to respond with the original cache key
  // and the full file contents until the FE is ready to receive the split files.
  // Once the FE is ready, we can replace lines 92-104 with the previous implementation:
  // const cache = getCache(cacheKey);
  return cache.wrap(cacheKeyOriginal, fetchValue).then(
    (result) => {
      const response = processResponseFn ? processResponseFn(result) : result;
      callback(null, response);
    },
    (err) => {
      callback(err, null);
    }
  );
}

module.exports = {
  cacheResponse,
  getCache,
  clearMemoryCache,
};
