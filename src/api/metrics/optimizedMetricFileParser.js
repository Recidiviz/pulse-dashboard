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

import toInteger from "lodash/fp/toInteger";
import {
  convertFromStringToUnflattenedMatrix,
  getDimensionKey,
  getDimensionValue,
  getValueKey,
  validateMetadata,
} from "shared-filters";

/**
 * Expands the optimized metric file format into an array of json objects.
 *
 * The optimized format consists of a compact matrix that has been flattened
 * into a single array of values, with a collection of adjoining metadata that
 * are required to locate a particular data point in the array. To create the
 * expanded representation, we first unflatten the array into a set of nested
 * arrays -- one array per dimension plus one per value in the data point. We
 * then iterate over each data point, i.e. each column across these nested
 * arrays, using the metadata to retrieve each dimension key-value pair and each
 * value key-value pair.
 */
const expandMetricRepresentation = (contents, metadata) => {
  validateMetadata(metadata);
  const totalDataPoints = toInteger(metadata.total_data_points);
  const dimensions = metadata.dimension_manifest;
  const valueKeys = metadata.value_keys;

  if (totalDataPoints === 0) {
    // Short-circuit if the response is empty
    return [];
  }

  const unflattenedValues = convertFromStringToUnflattenedMatrix(
    contents,
    totalDataPoints
  );

  const dataPoints = [];
  let i = 0;
  for (i = 0; i < totalDataPoints; i += 1) {
    const dataPoint = {};

    let j = 0;
    for (j = 0; j < dimensions.length; j += 1) {
      const dimensionValueIndex = unflattenedValues[j][i];
      const dimensionKey = getDimensionKey(dimensions, j);
      const dimensionValue = getDimensionValue(
        dimensions,
        j,
        dimensionValueIndex
      );
      dataPoint[dimensionKey] = dimensionValue;
    }

    for (
      j = dimensions.length;
      j < dimensions.length + valueKeys.length;
      j += 1
    ) {
      const valueValue = unflattenedValues[j][i];
      const valueKey = getValueKey(valueKeys, j - dimensions.length);
      dataPoint[valueKey] = valueValue;
    }

    dataPoints.push(dataPoint);
  }

  return dataPoints;
};

export default expandMetricRepresentation;
