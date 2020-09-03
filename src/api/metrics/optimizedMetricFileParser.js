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

/**
 * Returns the key of the dimension field that resides within the dimension manifest at the
 * given index. `dimensions` is expected to be an array of arrays, where each array
 * is a separate dimension and the first element in each array is the dimension key.
 */
const getDimensionKey = (dimensions, dimensionIndex) => {
  return dimensions[dimensionIndex][0];
};

/**
 * Returns the value of the dimension field that resides within the dimension manifest at the
 * given key index and value index. `dimensions` is expected to be an array of arrays, where each array
 * is a separate dimension and the second element in each array is an array of possible values for
 * that dimension.
 *
 * The value is returned in UPPERCASE because it is conventional that dimension values used elsewhere
 * in the app for filtering purposes will be UPPERCASE, as well.
 */
const getDimensionValue = (dimensions, dimensionIndex, dimensionValueIndex) => {
  const value = dimensions[dimensionIndex][1][dimensionValueIndex];
  if (!value) {
    throw new Error(
      `Metric file value array references dimension value index of ${dimensionValueIndex} which is not found in the dimension_manifest for dimension of index ${dimensionIndex}. Dimension manifest for that dimension is ${dimensions[dimensionIndex]}`
    );
  }
  return value.toUpperCase();
};

/**
 * Returns the key of the value field at the given index.
 */
const getValueKey = (valueKeys, valueIndex) => {
  return valueKeys[valueIndex];
};

/**
 * Converts the given optimized array as a singular string into an array of values.
 */
const stringToArray = (contentsAsString) => {
  return contentsAsString.split(",");
};

/**
 * Unflattens the array by partitioning it into several sub-arrays of equal
 * length, a length equal to totalDataPoints specifically. Assumes that the
 * entire array length is divisible by totalDataPoints.
 */
const unflattenValues = (flattenedValues, totalDataPoints) => {
  const unflattened = [];
  let i;
  let j;
  const chunk = totalDataPoints;
  for (i = 0, j = flattenedValues.length; i < j; i += chunk) {
    const dimensionArray = flattenedValues.slice(i, i + chunk);
    unflattened.push(dimensionArray);
  }

  return unflattened;
};

/**
 * Validates the given metric file metadata to ensure that certain assumptions are met:
 *   - That metadata.total_data_points is defined and is numeric
 *   - That metadata.value_keys is defined and is a non-empty array
 *   - That metadata.dimension_manifest is defined and is a non-empty array
 *   - That each entry in metadata.dimension_manifest is itself an array of length 2 (dimension_key, [possible_values])
 *   - That each array of possible values in metadata.dimension_manifest is a non-empty array
 */
const validateMetadata = (metadata) => {
  if (metadata.total_data_points === undefined) {
    throw new Error(
      'Given metric file metadata has undefined "total_data_points"'
    );
  }
  if (Number.isNaN(Number(metadata.total_data_points))) {
    throw new Error(
      `Given metric file metadata has a non-numeric value for "total_data_points": ${metadata.total_data_points}`
    );
  }

  const valueKeys = metadata.value_keys;
  if (!Array.isArray(valueKeys) || !valueKeys.length) {
    throw new Error(
      `Given metric file metadata requires a non-empty array of value keys, but "value_keys" equals ${valueKeys}`
    );
  }

  const dimensions = metadata.dimension_manifest;
  if (!Array.isArray(dimensions) || !dimensions.length) {
    throw new Error(
      `Given metric file metadata requires a non-empty array of dimension ranges, but "dimension_manifest" equals ${dimensions}`
    );
  }

  const malformedDimensions = [];
  dimensions.forEach((dimension) => {
    if (!Array.isArray(dimension) || dimension.length !== 2) {
      malformedDimensions.push(dimension);
    }
  });
  if (malformedDimensions.length > 0) {
    throw new Error(
      `Given metric file dimension manifest contains malformed dimensions that are not tuples: ${malformedDimensions.join(
        ", "
      )}`
    );
  }

  const malformedDimensionRanges = [];
  dimensions.forEach((dimension) => {
    if (!Array.isArray(dimension[1])) {
      malformedDimensionRanges.push(dimension);
    }
  });
  if (malformedDimensionRanges.length > 0) {
    throw new Error(
      `Given metric file dimension manifest contains dimensions with a set of possible values that is not an array: ${malformedDimensionRanges.join(
        ", "
      )}`
    );
  }
};

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

  const flattenedValues = stringToArray(contents);
  const unflattenedValues = unflattenValues(flattenedValues, totalDataPoints);

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
