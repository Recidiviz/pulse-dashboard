// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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
const { toInteger } = require("lodash/fp");
const {
  filterOptimizedDataFormat,
  convertFromStringToUnflattenedMatrix,
} = require("shared-filters");
const {
  getSubsetDimensionKeys,
  createFlattenedValueMatrix,
  createSubsetMetadata,
} = require("./subsetFileHelpers");
const { FILES_WITH_SUBSETS } = require("../constants/subsetManifest");
const { getFilterFnByFile } = require("./filterHelpers");

/**
 * Convert the flattenedValueMatrix into a nested array and apply the filters
 *
 * @param {string} flattenedValueMatrix
 * @param {Object} metadata
 * @param {(item: object, dimensionKey: string) => boolean} filterFn - Filter function to determine which items are filtered out
 *
 * @returns {Object[]} - Returns an array of filtered objects
 */
function getFilteredDataPoints(flattenedValueMatrix, metadata, filterFn) {
  const subsetDimensions = getSubsetDimensionKeys();
  const totalDataPoints = toInteger(metadata.total_data_points);
  const skipFilterFn = (dimensionKey) =>
    !subsetDimensions.includes(dimensionKey);

  const unflattenedMatrix = convertFromStringToUnflattenedMatrix(
    flattenedValueMatrix,
    totalDataPoints
  );

  return filterOptimizedDataFormat(
    unflattenedMatrix,
    metadata,
    filterFn,
    skipFilterFn
  );
}

/**
 * Apply the subset filters to the metric file
 *
 * @param {string} fileKey - Name of the metric file
 * @param {Object} subsetFilters - Filters with all the dimension values from the subset manifest
 * @param {Object} metricFile
 * @param {string} metricFile.flattenedValueMatrix
 * @param {Object} metricFile.metadata
 * @param {string} metricFile.metadata.total_data_points
 * @param {string} metricFile.metadata.total_data_points
 * @param {String[][]} metricFile.metadata.dimension_manifest
 * @param {String[]} metricFile.metadata.value_keys
 *
 * @returns {Object} Returns an object with the subset file with the filters applied and a metadata
 * object with a dimension_manifest reflecting the subset values.
 */
function applyFilters(fileKey, subsetFilters, metricFile) {
  if (!FILES_WITH_SUBSETS.includes(fileKey)) {
    return metricFile;
  }
  const { flattenedValueMatrix, metadata } = metricFile[fileKey];
  const filterFn = getFilterFnByFile(fileKey, subsetFilters);
  const filteredData = getFilteredDataPoints(
    flattenedValueMatrix,
    metadata,
    filterFn
  );

  const subsetMetadata = createSubsetMetadata(
    filteredData.length,
    metadata,
    subsetFilters
  );

  const subsetFlattenedValueMatrix = createFlattenedValueMatrix(
    filteredData,
    subsetMetadata
  );

  return {
    [fileKey]: {
      flattenedValueMatrix: subsetFlattenedValueMatrix,
      metadata: subsetMetadata,
    },
  };
}

exports.default = applyFilters;
