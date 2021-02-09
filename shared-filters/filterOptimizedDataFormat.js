const { toInteger } = require("lodash/fp");
const {
  validateMetadata,
  getDimensionKey,
  getDimensionValue,
  getValueKey,
} = require("./optimizedFormatHelpers");

function filterOptimizedDataFormat(
  unflattenedMatrix,
  metadata,
  filterFn,
  skipFilterFn = () => false
) {
  if (!Array.isArray(unflattenedMatrix[0])) {
    throw new Error(
      `Invalid data type supplied to filterOptimizedDataFormat, expected 2D array of values.`
    );
  }

  validateMetadata(metadata);

  const totalDataPoints = toInteger(metadata.total_data_points);
  const dimensions = metadata.dimension_manifest;
  const valueKeys = metadata.value_keys;
  const filteredDataPoints = [];

  let i = 0;
  for (i = 0; i < totalDataPoints; i += 1) {
    const dataPoint = {};
    let matchesFilter = true;

    let j = 0;
    for (j = 0; j < dimensions.length; j += 1) {
      const dimensionValueIndex = unflattenedMatrix[j][i];

      const dimensionKey = getDimensionKey(dimensions, j);
      const dimensionValue = getDimensionValue(
        dimensions,
        j,
        dimensionValueIndex
      );

      if (skipFilterFn(dimensionKey)) {
        // If we do not want to apply the filter fn for this specific dimensionKey, do not filter anything here.
        // This is the case on the server-side when we may have filters defined for dimensions
        // that are not in the subset manifest.
        matchesFilter = true;
      } else {
        matchesFilter = filterFn(
          { [dimensionKey]: dimensionValue },
          dimensionKey
        );
      }

      if (!matchesFilter) {
        break;
      }

      dataPoint[dimensionKey] = dimensionValue;
    }

    if (!matchesFilter) {
      /* eslint-disable-next-line no-continue */
      continue;
    }

    for (
      j = dimensions.length;
      j < dimensions.length + valueKeys.length;
      j += 1
    ) {
      const valueValue = unflattenedMatrix[j][i];
      const valueKey = getValueKey(valueKeys, j - dimensions.length);
      dataPoint[valueKey] = valueValue;
    }

    filteredDataPoints.push(dataPoint);
  }

  return filteredDataPoints;
}

module.exports = { filterOptimizedDataFormat };
