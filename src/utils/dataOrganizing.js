/**
 * Sorts the data points by year and month, ascending.
 * Assumes that the the data is in the format:
 * [[year, month, data], [year, month, data], ...]
 */
function sortByYearAndMonth(dataPoints) {
  return dataPoints.sort((a, b) => ((a[0] === b[0]) ? (a[1] - b[1]) : (a[0] - b[0])));
}

function sortByLabel(dataPoints, labelIndex) {
  return dataPoints.sort((a, b) => (a[labelIndex].localeCompare(b[labelIndex])));
}

function filterMostRecentMonths(dataPoints, monthCount) {
  return dataPoints.slice(dataPoints.length - monthCount, dataPoints.length);
}

/**
 * Sorts the data points by year and month, ascending, and then returns the
 * most recent `monthCount` number of months.
 */
function sortAndFilterMostRecentMonths(unsortedDataPoints, monthCount) {
  const sortedData = sortByYearAndMonth(unsortedDataPoints);
  return filterMostRecentMonths(sortedData, monthCount);
}

export {
  filterMostRecentMonths,
  sortAndFilterMostRecentMonths,
  sortByLabel,
  sortByYearAndMonth,
};
