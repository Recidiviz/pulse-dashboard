import qs from "qs";
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

  return { data: metricFile, metadata: {} };
}

/**
 *
 * @param {Object} filters - The filter values used to construct the query string to request metric data
 * @param {string} filters.chargeCategory - A charge category or "All"
 * @param {Array} filters.district - District IDs or "All"
 * @param {string} filters.metricPeriodMonths - The number of months in the time period
 * @param {string} filters.supervisionType - Supervision Type or "All"
 * @param {string} filters.supervisionLevel - Supervision level or "All"
 * @param {string} filters.reportedViolations - Number of reported violations or "All"
 * @param {string} filters.violationType - Violation type
 */
export function getQueryStringFromFilters(filters = {}) {
  return qs.stringify(filters, {
    encode: false,
    addQueryPrefix: true,
    filter: (_, value) => (value !== "" ? value : undefined),
  });
}

export function dimensionManifestIncludesFilterValues({
  filters,
  dimensionManifest,
  ignoredSubsetDimensions = [],
  skippedFilters = [],
  treatCategoryAllAsAbsent = false,
}) {
  if (!filters || !dimensionManifest) return false;
  return Object.keys(filters).every((filterType) => {
    if (
      skippedFilters.includes(filterType) ||
      ignoredSubsetDimensions.includes(filterType) ||
      // This is for the CaseTable
      (filters[filterType].toLowerCase() === "all" && treatCategoryAllAsAbsent)
    ) {
      return true;
    }
    if (dimensionManifest[filterType] === undefined) {
      throw new Error(
        `Expected to find ${filterType} in the dimension manifest. Should this filter be skipped?`
      );
    }
    return dimensionManifest[filterType].includes(
      filters[filterType].toLowerCase()
    );
  });
}
