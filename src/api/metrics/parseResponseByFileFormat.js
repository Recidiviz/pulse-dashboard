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

import expandMetricRepresentation from "./optimizedMetricFileParser";

/**
 * Parses the given metric response based on the format of the given data.
 */
const parseResponseByFileFormat = (responseData, file) => {
  const fileNames = file ? [file] : Object.keys(responseData);

  return fileNames.reduce((files, fileName) => {
    const metricFile = responseData[fileName];

    if (metricFile.flattenedValueMatrix) {
      // If it has the key flattenedValueMatrix, it's the optimized format.
      return {
        ...files,
        [fileName]: expandMetricRepresentation(
          metricFile.flattenedValueMatrix,
          metricFile.metadata
        ),
      };
    }
    // Otherwise, it's the verbose json lines format that is ready to go.
    return { ...files, [fileName]: metricFile };
  }, {});
};

export default parseResponseByFileFormat;
