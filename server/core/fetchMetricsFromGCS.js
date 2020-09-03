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

const BUCKET_NAME = process.env.METRIC_BUCKET;
const objectStorage = require("./objectStorage");
const { getFilesByMetricType } = require("./getFilesByMetricType");

/**
 * Retrieves all metric files for the given metric type from Google Cloud Storage.
 *
 * Returns a list of Promises, one per metric file for the given type, where each Promise will
 * eventually return either an error or an object with two keys:
 *   - `fileKey`: a unique key for identifying the metric file, e.g. 'revocations_by_month'
 *   - `contents`: the contents of the file deserialized into JS objects/arrays
 *   - `file`: (optional) a specific metric file under this metric type to request. If absent,
 *             requests all files for the given metric type.
 */
function fetchMetricsFromGCS(stateCode, metricType, file) {
  const promises = [];

  try {
    const files = getFilesByMetricType(metricType, file);
    files.forEach((filename) => {
      const fileKey = filename.replace(".json", "");
      promises.push(
        objectStorage
          .downloadFile(BUCKET_NAME, stateCode, filename)
          .then((contents) => ({ fileKey, contents }))
      );
    });
  } catch (e) {
    promises.push(Promise.reject(e));
  }

  return promises;
}

exports.default = fetchMetricsFromGCS;
