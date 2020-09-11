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

const {
  default: processJsonLinesMetricFile,
} = require("./processJsonLinesMetricFile");
const {
  default: processOptimizedTxtMetricFile,
} = require("./processOptimizedTxtMetricFile");

/**
 * Processes the given metric file, a Buffer of bytes, returning a json object
 * structured based on the given format.
 */
function processMetricFile(contents, metadata, extension) {
  const stringContents = contents.toString();
  if (!stringContents || stringContents.length === 0) {
    return null;
  }

  if (extension.toLowerCase() === ".json") {
    return processJsonLinesMetricFile(stringContents);
  }
  if (extension.toLowerCase() === ".txt") {
    return processOptimizedTxtMetricFile(stringContents, metadata);
  }

  return {};
}

exports.default = processMetricFile;
