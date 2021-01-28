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

const getSubsetDimensionValues = (key, value) => {
  const subsets = Object.fromEntries(SUBSET_MANIFEST)[key];
  return subsets.find((subset) => subset.includes(value.toLowerCase()));
};

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
  return unflattenedMatrix.flat().join(",");
}

function createSubsetDimensionManifest(dimensionManifest, subsetFilters) {
  const subsetKeys = getSubsetDimensionKeys();
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
  createSubsetDimensionManifest,
  createSubsetMetadata,
  getSubsetDimensionKeys,
  getSubsetDimensionValues,
};
