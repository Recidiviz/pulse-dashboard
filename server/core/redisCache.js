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
 * Creates the redis caching manager and client and provides the helper function `cacheInRedis`.
 *
 * The function `cacheInRedis`  wraps fetches and caches the values returned.
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

const REDISHOST = process.env.REDISHOST || "localhost";
const REDISPORT = process.env.REDISPORT || 6379;
const REDISAUTH = process.env.REDISAUTH || "";

// Expire items in cache after 1 day
const REDIS_CACHE_TTL_SECONDS = 60 * 60 * 24;
// Set refresh threshold to 1 hour
const REDIS_CACHE_REFRESH_THRESHOLD = 60 * 60;

const redisInstance = new Redis({
  host: REDISHOST,
  port: REDISPORT,
  password: REDISAUTH,
  ttl: REDIS_CACHE_TTL_SECONDS,
  db: 0,
});

const testEnv = process.env.NODE_ENV === "test";

const redisCache = cacheManager.caching({
  store: testEnv ? "memory" : redisStore,
  refreshThreshold: REDIS_CACHE_REFRESH_THRESHOLD,
  redisInstance,
});

if (!testEnv) {
  const redisClient = redisCache.store.getClient();
  redisClient.on("error", (error) => {
    console.error("ERR:REDIS:", error);
  });
}

function clearRedisCache() {
  return redisCache.reset();
}

function cacheInRedis(cacheKey, fetchValue, callback) {
  return redisCache.wrap(cacheKey, fetchValue).then(
    (result) => {
      callback(null, result);
    },
    (err) => {
      callback(err, null);
    }
  );
}

module.exports = { cacheInRedis, redisCache, clearRedisCache };
