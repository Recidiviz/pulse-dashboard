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
 * Retrieves the metrics for the given metric type and passes them into the given callback.
 *
 * The callback should be a function with a signature of `function (error, results)`. `results` is
 * a single object with keys mapping to individual metric files and values corresponding to the
 * deserialized contents of those files.
 *
 * First checks the cache to see if the metrics with the given type are already in memory and not
 * expired beyond the configured TTL. If not, then fetches the metrics for that type from the
 * appropriate files and invokes the callback only once all files have been retrieved.
 *
 * If we are in demo mode, then fetches the files from a static directory, /server/core/demo_data/.
 * Otherwise, fetches from Google Cloud Storage.
 */
/* eslint-disable no-console */

const { default: processMetricFile } = require("./processMetricFile");
const { default: fetchMetricsFromLocal } = require("./fetchMetricsFromLocal");
const { default: fetchMetricsFromGCS } = require("./fetchMetricsFromGCS");

function fetchMetrics(stateCode, metricType, file, isDemo) {
  const fetcher = isDemo ? fetchMetricsFromLocal : fetchMetricsFromGCS;
  const source = isDemo ? "local" : "GCS";

  console.log(`Fetching ${metricType} metrics from ${source}...`);
  const metricPromises = fetcher(stateCode.toUpperCase(), metricType, file);

  return Promise.all(metricPromises).then((allFileContents) => {
    const results = {};
    allFileContents.forEach((contents) => {
      console.log(`Fetched contents for fileKey ${contents.fileKey}`);
      results[contents.fileKey] = processMetricFile(
        contents.contents,
        contents.metadata,
        contents.extension
      );
    });
    console.log(`Fetched all ${metricType} metrics from ${source}`);
    return results;
  });
}

exports.default = fetchMetrics;
