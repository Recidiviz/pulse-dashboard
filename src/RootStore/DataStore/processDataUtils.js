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

export function processResponseData(data, metricType, eagerExpand = true) {
  const metricFile = parseResponseByFileFormat(data, metricType, eagerExpand);

  if (!Array.isArray(metricFile)) {
    return {
      metadata: metricFile.metadata,
      data: unflattenValues(metricFile),
    };
  }

  return {
    data: metricFile,
  };
}
