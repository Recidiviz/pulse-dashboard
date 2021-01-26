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

const { FILES_BY_METRIC_TYPE } = require("../constants/filesByMetricType");

/**
 * Retrieves the names of all of the files which are available for the given metric type,
 * with the filenames that are hard-coded for each file.
 *
 * If a specific file is requested, this checks that the file is available for the
 * given metric type, and sets the proper extension on the filename.
 */
function getFilesByMetricType(metricType, file) {
  const files = FILES_BY_METRIC_TYPE[metricType];

  if (!files) {
    throw new Error(`No such metric type ${metricType}`);
  }

  if (file) {
    const txtFile = files.find((item) => item === `${file}.txt`);
    const jsonFile = files.find((item) => item === `${file}.json`);

    if (txtFile) {
      return [txtFile];
    }

    if (jsonFile) {
      return [jsonFile];
    }

    throw new Error(
      `${file} not found with either txt or json extension for metric type ${metricType}`
    );
  }

  return files;
}

module.exports = { getFilesByMetricType };
