import qs from "qs";
import {
  REPORTED_VIOLATIONS,
  VIOLATION_TYPE,
} from "../../constants/filterTypes";

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
    // TODO[#641]: Remove adding "All" for violationType when the values are available in the metric file.
    filter: (key, value) => {
      if (key === VIOLATION_TYPE && value === "") {
        return "All";
      }
      return value !== "" ? value : undefined;
    },
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
      // TODO - remove these two specific checks once reported_violations
      // and violation_type are unnested
      (filterType === REPORTED_VIOLATIONS && filters[filterType] === "") ||
      (filterType === VIOLATION_TYPE && filters[filterType] === "") ||
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
