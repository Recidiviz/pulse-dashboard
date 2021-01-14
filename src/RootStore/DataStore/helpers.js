import toInteger from "lodash/fp/toInteger";
import { convertFromStringToUnflattenedMatrix } from "../../api/metrics/optimizedFormatHelpers";
import { parseResponseByFileFormat } from "../../api/metrics/fileParser";

export function unflattenValues(metricFile) {
  const totalDataPoints = toInteger(metricFile.metadata.total_data_points);
  return totalDataPoints === 0
    ? []
    : convertFromStringToUnflattenedMatrix(
        metricFile.flattenedValueMatrix,
        totalDataPoints
      );
}

export function processResponseData(data, file, eagerExpand = true) {
  console.log(data, file, eagerExpand);
  const metricFile = parseResponseByFileFormat(data, file, eagerExpand);
  const { metadata } = metricFile;
  // If we are not eagerly expanding a single file request, then proactively
  // unflatten the data matrix to avoid repeated unflattening operations in
  // filtering operations later on.
  if (!eagerExpand) {
    return {
      metadata,
      data: unflattenValues(metricFile),
    };
  }

  return metricFile;
}
