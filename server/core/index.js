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
 * Utilities for retrieving and caching metrics for the app.
 *
 * In the current implementation, metrics are generated by the Recidiviz data platform and stored
 * in two separate formats as metric files in Google Cloud Storage: an optimized format as compressed
 * txt files that represent compact versions of sparse matrices, and a more readable format via
 * JSON Lines. Those files are pulled down and cached in memory with a TTL. That TTL is unaffected by
 * access to the cache, so files are re-fetched at a predictable cadence, allowing for updates to
 * those files to be quickly reflected in the app without frequent requests to GCS.
 */
const { default: fetchMetrics } = require("./fetchMetrics");
const {
  default: filterRestrictedAccessEmails,
} = require("./filterRestrictedAccessEmails");
const { default: refreshRedisCache } = require("./refreshRedisCache");
const { default: fetchMetricsFromLocal } = require("./fetchMetricsFromLocal");
const { default: fetchMetricsFromGCS } = require("./fetchMetricsFromGCS");
const { default: getFilesByMetricType } = require("./getFilesByMetricType");
const { cacheResponse } = require("./cacheManager");

module.exports = {
  fetchMetrics,
  filterRestrictedAccessEmails,
  fetchMetricsFromLocal,
  fetchMetricsFromGCS,
  getFilesByMetricType,
  refreshRedisCache,
  cacheResponse,
};
