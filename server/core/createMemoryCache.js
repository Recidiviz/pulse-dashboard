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

const cacheManager = require("cache-manager");
const { default: isDemoMode } = require("../utils/isDemoMode");

function createMemoryCache(ttl, refreshThreshold) {
  return cacheManager.caching({
    store: isDemoMode ? "none" : "memory",
    ttl,
    refreshThreshold,
  });
}

const METRIC_CACHE_TTL_SECONDS = 60 * 60; // Expire items in the cache after 1 hour
const METRIC_REFRESH_SECONDS = 60 * 10;

const memoryCache = createMemoryCache(
  METRIC_CACHE_TTL_SECONDS,
  METRIC_REFRESH_SECONDS
);

function cacheInMemory(cacheKey, fetchValue) {
  memoryCache.wrap(cacheKey, (cacheCb) => {
    fetchValue()
      .then((value) => cacheCb(null, value))
      .catch((err) => {
        console.error(err);
        cacheCb(err, null);
      });
  });
}

module.exports = { cacheInMemory };
