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

const { unzipSync } = require("zlib");
/**
 * Processes our optimized format metric file. This consists of a single,
 * flattened array that can be expanded into a compact matrix from which
 * data points can be located via metadata. The returned object has two keys:
 *   - `flattenedValueMatrix`: A comma-separated string of values which is a flattened
 *                             version of a collection of arrays forming a compact
 *                             representation of a sparse matrix.
 *   - `metadata`: An object with the metadata required to parse values from the
 *                 flattenedValueMatrix
 */
function processOptimizedTxtMetricFile(stringContents, metadata) {
  try {
    const decompressedStringContents = unzipSync(stringContents);
    console.log("Decompressed file...");
    return { flattenedValueMatrix: decompressedStringContents, metadata };
  } catch (error) {
    console.error(
      "An error occurred during decompression, assuming already decompressed...",
      error.code,
      error.errno
    );
    return { flattenedValueMatrix: stringContents, metadata };
  }
}

exports.default = processOptimizedTxtMetricFile;
