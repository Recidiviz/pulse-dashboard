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
const { getSubsetManifest } = require("../constants/subsetManifest");

const SUBSET_MANIFEST = getSubsetManifest();

const getSubsetDimensionKeys = () =>
  SUBSET_MANIFEST.map((dimension) => dimension[0]);

/**
 * Get all values from the subset manifest for the given dimension key and value.
 *
 * @param {string} key - Dimension key, i.e. "violation_type"
 * @param {number|string} value - Dimension value, can be either the actual value for the dimension key,
 * or an index to access all of the dimension values.
 *
 * @returns {String[]} - An array of all the subset dimension values for a given dimension key and value
 */
const getSubsetDimensionValues = (key, value) => {
  const subset = SUBSET_MANIFEST.find((s) => s[0] === key);
  if (typeof value === "number") return subset[1][value];
  const subsetValues = subset[1].find((s) => s.includes(value.toLowerCase()));
  return subsetValues;
};

/**
 * Convert an array of objects into a flattened value matrix string
 *
 * @param {Object[]} filteredDataPoints - An array of filtered objects
 * @param {Object} subsetMetadata - A metadata object with subset values in the dimension_manifest
 *
 * @returns {string} A string of all of the values in the filteredDataPoints, ordered by the subsetMetadata's
 * dimension_manifest and value_keys
 */
function createFlattenedValueMatrix(filteredDataPoints, subsetMetadata) {
  const dimensions = subsetMetadata.dimension_manifest;
  const valueKeys = subsetMetadata.value_keys;
  const totalDataPoints = filteredDataPoints.length;
  const unflattenedMatrix = [];

  for (let j = 0; j < totalDataPoints; j += 1) {
    for (let i = 0; i < dimensions.length; i += 1) {
      const dimensionKey = dimensions[i][0];
      const dimensionValues = dimensions[i][1];
      const dimensionValueIndex = dimensionValues.indexOf(
        filteredDataPoints[j][dimensionKey].toLowerCase()
      );
      if (unflattenedMatrix[i]) {
        unflattenedMatrix[i][j] = dimensionValueIndex;
      } else {
        unflattenedMatrix[i] = [];
        unflattenedMatrix[i][j] = dimensionValueIndex;
      }
    }

    for (
      let v = dimensions.length;
      v < dimensions.length + valueKeys.length;
      v += 1
    ) {
      const valueKey = valueKeys[v - dimensions.length];
      const valueValue = filteredDataPoints[j][valueKey];
      if (unflattenedMatrix[v]) {
        unflattenedMatrix[v][j] = valueValue;
      } else {
        unflattenedMatrix[v] = [];
        unflattenedMatrix[v][j] = valueValue;
      }
    }
  }
  return [].concat(...unflattenedMatrix).join(",");
}

/**
 * Transforms a dimensionManifest from a metric file to only include the values from the subset filters
 * if the dimension key is in the subset manifest. All dimension keys/values that are not in the subset manifest
 * are also included.
 *
 * @param {String[][]} dimensionManifest - The original dimension manifest from a metric file
 * @param {Object} subsetFilters - Filters with all the dimension values from the subset manifest
 *
 * @returns {String[][]}
 */
function createSubsetDimensionManifest(dimensionManifest, subsetFilters) {
  const subsetKeys = getSubsetDimensionKeys().concat(
    "level_1_supervision_location"
  );
  const transformedDimensionManifest = [];

  dimensionManifest.forEach(([dimensionKey, dimensionValues]) => {
    if (subsetKeys.includes(dimensionKey) && subsetFilters[dimensionKey]) {
      transformedDimensionManifest.push([
        dimensionKey,
        subsetFilters[dimensionKey].sort(),
      ]);
    } else {
      transformedDimensionManifest.push([dimensionKey, dimensionValues.sort()]);
    }
  });
  return transformedDimensionManifest;
}

/**
 * Transforms the metadata to include the filtered total_data_points and the transformed dimension_manifest
 * @param {number} totalDataPoints - The total data points in the filtered data
 * @param {Object} metadata - The original metadata object from the metric file
 * @param {Object} subsetFilters - The filters with all of the subset values
 *
 * @returns {Object} - Returns the subset metadata with provided total data points and the new subset dimension manifest.
 *
 */
function createSubsetMetadata(totalDataPoints, metadata, subsetFilters) {
  return {
    ...metadata,
    total_data_points: totalDataPoints,
    dimension_manifest: createSubsetDimensionManifest(
      metadata.dimension_manifest,
      subsetFilters
    ),
  };
}

module.exports = {
  createFlattenedValueMatrix,
  createSubsetMetadata,
  getSubsetDimensionKeys,
  getSubsetDimensionValues,
};
