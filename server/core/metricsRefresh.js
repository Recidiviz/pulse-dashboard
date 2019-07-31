/**
 * Utilities for automatically refreshing metric caches on a scheduled interval.
 *
 * Metrics are cached in memory as they are updated relatively infrequently (on the order of hours),
 * in /server/core/metricsApi.js. Invoking the metricsApi.fetch methods performs a cache check: if
 * the TTL has expired then the metrics are re-retrieved and cached again. Otherwise, the cached
 * metrics are returned straight away. Because of this, some of these refresh calls do not actually
 * trigger a refresh. Note that the metric caches do not reset the TTL on reads, so this is okay.
 */

var metricsApi = require('./metricsApi');

const METRIC_REFRESH_INTERVAL_MS = 1000 * 60 * 30; // Refresh metrics every 30 minutes

/**
 * Performs a refresh of the admission metrics cache, logging success or failure.
 */
function refreshAdmissionMetrics() {
  metricsApi.fetchAdmissionMetrics(function (err, data) {
    if (err) {
      console.log(`Encountered error during scheduled fetch-and-cache of admission metrics: ${err}`)
    } else {
      console.log("Executed scheduled fetch-and-cache of admission metrics");
    }
  });
}

/**
 * Performs a refresh of the reincarceration metrics cache, logging success or failure.
 */
function refreshReincarcerationMetrics() {
  metricsApi.fetchReincarcerationMetrics(function (err, data) {
    if (err) {
      console.log(`Encountered error during scheduled fetch-and-cache
        of reincarceration metrics: ${err}`)
    } else {
      console.log("Executed scheduled fetch-and-cache of reincarceration metrics");
    }
  });
}

/**
 * Performs a refresh of the revocation metrics cache, logging success or failure.
 */
function refreshRevocationMetrics() {
  metricsApi.fetchRevocationMetrics(function (err, data) {
    if (err) {
      console.log(`Encountered error during scheduled fetch-and-cache
        of revocation metrics: ${err}`)
    } else {
      console.log("Executed scheduled fetch-and-cache of revocation metrics");
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

executeAndSetInterval(refreshAdmissionMetrics, METRIC_REFRESH_INTERVAL_MS);
executeAndSetInterval(refreshReincarcerationMetrics, METRIC_REFRESH_INTERVAL_MS);
executeAndSetInterval(refreshRevocationMetrics, METRIC_REFRESH_INTERVAL_MS);
