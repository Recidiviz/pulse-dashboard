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
const { getFileExtension, getFileName } = require("../utils/fileName");
const {
  default: getMetricsByType,
} = require("../collections/getMetricsByType");
/**
 * Retrieves all metric files for the given metric type from Google Cloud Storage.
 *
 * Returns a list of Promises, one per metric file for the given type, where each Promise will
 * eventually return either an error or an object with the following keys:
 *   - `fileKey`: a unique key for identifying the metric file, e.g. 'revocations_by_month'
 *   - `extension`: the extension of the metric file, either .txt or .json
 *   - `contents`: the contents of the file deserialized into JS objects/arrays
 *   - `metadata`: (optional) the metadata of the metric file, if it is in the
 optimized (compressed .txt) format
 */
function fetchMetricsFromGCS(stateCode, metricType, file) {
  const promises = [];

  try {
    const metric = getMetricsByType(metricType, stateCode);
    const files = metric.getFiles(file);

    files.forEach((filename) => {
      const fileKey = getFileName(filename);
      const extension = getFileExtension(filename);

      const filePromise = objectStorage.downloadFile(
        BUCKET_NAME,
        stateCode,
        filename
      );
      const metadataPromise = objectStorage.downloadFileMetadata(
        BUCKET_NAME,
        stateCode,
        filename
      );

      promises.push(
        Promise.all([filePromise, metadataPromise]).then(
          ([fileContents, fileMetadata]) => {
            const contents = fileContents;
            const lastUpdated = fileMetadata[0] && fileMetadata[0].updated;
            const rawMetadata = fileMetadata[0] && fileMetadata[0].metadata;

            const metadata = {};
            if (rawMetadata) {
              metadata.updated = lastUpdated;
              metadata.value_keys = JSON.parse(rawMetadata.value_keys);
              metadata.total_data_points = rawMetadata.total_data_points;
              metadata.dimension_manifest = JSON.parse(
                rawMetadata.dimension_manifest
              );
            }

            metric.validateDimensionsForFile(
              fileKey,
              metadata.dimension_manifest
            );

            return { fileKey, extension, metadata, contents };
          }
        )
      );
    });
  } catch (e) {
    promises.push(Promise.reject(e));
  }

  return promises;
}

exports.default = fetchMetricsFromGCS;
