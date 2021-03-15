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

const fs = require("fs");
const util = require("util");
const path = require("path");
const { getFileExtension, getFileName } = require("../utils/fileName");
const {
  default: getMetricsByType,
} = require("../collections/getMetricsByType");

const asyncReadFile = util.promisify(fs.readFile);

/**
 * This is a parallel to fetchMetricsFromGCS, but instead fetches metric files from the local
 * file system. The return format, a list of Promises that resolve to an object with the
 * keys described therein, is identical.
 */
function fetchMetricsFromLocal(stateCode, metricType, metricName) {
  const promises = [];

  try {
    const metric = getMetricsByType(metricType, stateCode);
    const files = metric.getFileNamesList(metricName);

    files.forEach((filename) => {
      const fileKey = getFileName(filename);
      const extension = getFileExtension(filename);
      const filePath = path.resolve(__dirname, `./demo_data/${filename}`);
      let metadata = {};
      if (extension === ".txt") {
        const metadataFilePath = path.resolve(
          __dirname,
          `./demo_data/${fileKey}.metadata.json`
        );

        metadata = JSON.parse(fs.readFileSync(metadataFilePath));
      }

      promises.push(
        asyncReadFile(filePath).then((contents) => ({
          fileKey,
          extension,
          metadata,
          contents,
        }))
      );
    });
  } catch (e) {
    promises.push(Promise.reject(e));
  }

  return promises;
}

exports.default = fetchMetricsFromLocal;
