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

export {
  getDimensionKey,
  getDimensionValue,
  getValueKey,
  stringToArray,
  unflattenValues,
  validateMetadata,
};
