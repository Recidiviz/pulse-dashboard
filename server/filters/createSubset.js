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
  createFlattenedValueMatrix,
  createSubsetMetadata,
  getSubsetDimensionKeys,
} = require("./subsetFileHelpers");
const {
  FILES_WITH_SUBSETS,
  getSubsetManifest,
} = require("../constants/subsetManifest");
const { getFilterFnByMetricName } = require("./filterHelpers");

/**
 * Given a metric file with a flattened value matrix and metadata, it converts the flattenedValueMatrix
 * into a nested array and applies the filters.
 *
 * @param {Object} data - An object with the properties `flattenedValueMatrix` and `metadata`.
 * @param {Object} filters - The filters to apply to the metric data
 * @param {(item: object, dimensionKey: string) => boolean} filterFn - Filter function to determine which items are filtered out
 *
 * @returns {Object[]} - Returns an object with the property `flattenedValueMatrix`, which has the filtered subset values,
 * and the property `metadata`, which has a dimension manifest reflecting the values in the subset.
 */
function applyFiltersToOptimizedFormat(data, filters, filterFn, skipFilterFn) {
  const { flattenedValueMatrix, metadata } = data;
  const totalDataPoints = toInteger(metadata.total_data_points);
  const unflattenedMatrix = convertFromStringToUnflattenedMatrix(
    flattenedValueMatrix,
    totalDataPoints
  );

  const filteredData = filterOptimizedDataFormat(
    unflattenedMatrix,
    metadata,
    filterFn,
    skipFilterFn
  );

  const subsetMetadata = createSubsetMetadata(
    filteredData.length,
    metadata,
    filters
  );

  const subsetFlattenedValueMatrix = createFlattenedValueMatrix(
    filteredData,
    subsetMetadata
  );

  return {
    flattenedValueMatrix: subsetFlattenedValueMatrix,
    metadata: subsetMetadata,
  };
}

/**
 * Given a metric file with an array of datapoints, it applies the filter function to the datapoints and
 * returns a subset of the data alongside a metadata object.
 *
 * @param {Object[]} dataPoints - An array of data points to filter
 * @param {Object} filters - The filters to apply to the metric data
 * @param {(item: object, dimensionKey: string) => boolean} filterFn - Filter function to determine which items are filtered out
 *
 * @returns {Object[]} - Returns an object with the property `data`, which has the filtered subset values as an array of objects,
 * and the property `metadata`, which has a dimension manifest reflecting the values in the subset.
 */
function applyFiltersToDataPoints(dataPoints, filters, filterFn) {
  const filteredData = dataPoints.filter((dataPoint) => filterFn(dataPoint));
  const subsetManifest = getSubsetManifest();
  const metadata = {
    dimension_manifest: subsetManifest,
    total_data_points: filteredData.length,
  };
  return {
    data: filteredData,
    metadata: createSubsetMetadata(filteredData.length, metadata, filters),
  };
}

/**
 * Apply the subset filters to the data in the metric file and return an object keyed by the metric name that includes the
 * data and the metadata for the subset.
 *
 * @param {string} metricName - Name of the metric file
 * @param {Object} subsetFilters - Filters with all the dimension values from the subset manifest
 * @param {Object.<string, metricName>} metricFile - An object with the metricName as key and value may either include a flattened value matrix with metadata, or an array of data point objects.
 * @param {Object[]} [metricFile.metricName] - Optional array of data point objects
 * @param {string} [metricFile.metricName.flattenedValueMatrix] - Optional flattened value matrix string
 * @param {Object} [metricFile.metricName.metadata] - Optional metadata for parsing the flattened value matrix
 * @param {string} [metricFile.metricName.metadata.total_data_points] - Number of data points in the flattened value matrix for a single dimension
 * @param {String[][]} [metricFile.metricName.metadata.dimension_manifest] - The enum dimensions included in the flattened value matrix
 * @param {String[]} [metricFile.metricName.metadata.value_keys] - The value dimensions included in the flattened value matrix
 *
 * @returns {Object} Returns an object keyed by the metric name with the subset data and a metadata
 * object with a dimension_manifest reflecting the subset values. If a flattened value matrix was provided, the data
 * is under the key `flattenedValueMatrix`, otherwise if an array of datapoints was provided, the subset data is under
 * the `data` key.
 */
function createSubset(metricName, subsetFilters, metricFile) {
  if (!FILES_WITH_SUBSETS.includes(metricName)) {
    return metricFile;
  }

  const filterFn = getFilterFnByMetricName(metricName, subsetFilters);

  if (Array.isArray(metricFile[metricName])) {
    return {
      [metricName]: applyFiltersToDataPoints(
        metricFile[metricName],
        subsetFilters,
        filterFn
      ),
    };
  }
  const skipFilterFn = (dimensionKey) =>
    !getSubsetDimensionKeys().includes(dimensionKey);

  /* eslint-disable no-console */
  console.log(
    `Creating subset file for: ${metricName} with filters: ${JSON.stringify(
      subsetFilters
    )}`
  );

  return {
    [metricName]: applyFiltersToOptimizedFormat(
      metricFile[metricName],
      subsetFilters,
      filterFn,
      skipFilterFn
    ),
  };
}

exports.default = createSubset;
