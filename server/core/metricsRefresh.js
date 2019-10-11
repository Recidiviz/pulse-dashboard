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
 * Utilities for automatically refreshing metric caches on a scheduled interval.
 *
 * Metrics are cached in memory as they are updated relatively infrequently (on the order of hours),
 * in /server/core/metricsApi.js. Invoking the metricsApi.fetch methods performs a cache check: if
 * the TTL has expired then the metrics are re-retrieved and cached again. Otherwise, the cached
 * metrics are returned straight away. Because of this, some of these refresh calls do not actually
 * trigger a refresh. Note that the metric caches do not reset the TTL on reads, so this is okay.
 */

const metricsApi = require('./metricsApi');
const demoMode = require('../utils/demoMode');

const isDemoMode = demoMode.isDemoMode();

const METRIC_REFRESH_INTERVAL_MS = 1000 * 60 * 30; // Refresh metrics every 30 minutes

/**
 * Performs a refresh of the program evaluation metrics cache, logging success or failure.
 */
function refreshProgramEvalMetrics() {
  metricsApi.fetchProgramEvalMetrics(isDemoMode, (err, data) => {
    if (err) {
      console.log(`Encountered error during scheduled fetch-and-cache
        of program evaluation metrics: ${err}`);
    } else {
      console.log('Executed scheduled fetch-and-cache of program evaluation metrics');
    }
  });
}

/**
 * Performs a refresh of the reincarceration metrics cache, logging success or failure.
 */
function refreshReincarcerationMetrics() {
  metricsApi.fetchReincarcerationMetrics(isDemoMode, (err, data) => {
    if (err) {
      console.log(`Encountered error during scheduled fetch-and-cache
        of reincarceration metrics: ${err}`);
    } else {
      console.log('Executed scheduled fetch-and-cache of reincarceration metrics');
    }
  });
}

/**
 * Performs a refresh of the revocation metrics cache, logging success or failure.
 */
function refreshRevocationMetrics() {
  metricsApi.fetchRevocationMetrics(isDemoMode, (err, data) => {
    if (err) {
      console.log(`Encountered error during scheduled fetch-and-cache
        of revocation metrics: ${err}`);
    } else {
      console.log('Executed scheduled fetch-and-cache of revocation metrics');
    }
  });
}

/**
 * Performs a refresh of the snapshot metrics cache, logging success or failure.
 */
function refreshSnapshotMetrics() {
  metricsApi.fetchSnapshotMetrics(isDemoMode, (err, data) => {
    if (err) {
      console.log(`Encountered error during scheduled fetch-and-cache of snapshot metrics: ${err}`);
    } else {
      console.log('Executed scheduled fetch-and-cache of snapshot metrics');
    }
  });
}

/**
 * A convenience method for scheduling a task to execute on an infinite schedule, but invoking the
 * first execution now instead of waiting the initial interval.
 */
function executeAndSetInterval(fn, intervalMS) {
  fn();
  setInterval(fn, intervalMS);
}

if (!isDemoMode) {
  executeAndSetInterval(refreshProgramEvalMetrics, METRIC_REFRESH_INTERVAL_MS);
  executeAndSetInterval(refreshReincarcerationMetrics, METRIC_REFRESH_INTERVAL_MS);
  executeAndSetInterval(refreshRevocationMetrics, METRIC_REFRESH_INTERVAL_MS);
  executeAndSetInterval(refreshSnapshotMetrics, METRIC_REFRESH_INTERVAL_MS);
}
