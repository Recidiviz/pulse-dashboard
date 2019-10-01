
const TRANSITIONAL_FACILITY_FILTERS = {
  US_ND: ['FTPFAR', 'GFC', 'BTC', 'FTPMND', 'MTPFAR', 'LRRP', 'MTPMND'],
  US_DEMO: ['GHI', 'PQR', 'VWX'],
};

const RELEASE_FACILITY_FILTERS = {
  US_ND: ['DWCRC', 'MRCC', 'JRCC', 'NDSP', 'TRCC', 'CJ', 'NTAD'],
  US_DEMO: ['ABC', 'DEF', 'JKL', 'MNO', 'STU', 'YZ'],
};

/**
 * Filters data points to only include the list of facilities corresponding to
 * the given `facilityType` and `stateCode`. Assumes the data is in the format:
 * [facilityName, dataValue]
 */
function filterFacilities(dataPoints, facilityType, stateCode) {
  const facilityArray = (facilityType === 'TRANSITIONAL' ? TRANSITIONAL_FACILITY_FILTERS[stateCode] : RELEASE_FACILITY_FILTERS[stateCode]);

  const filteredData = [];
  dataPoints.forEach((data) => {
    if (facilityArray.includes(data[0])) {
      filteredData.push(data);
    }
  });

  return filteredData;
}

/**
 * Sorts the data points by year and month, ascending.
 * Assumes that the the data is in the format:
 * [[year, month, data], [year, month, data], ...]
 */
function sortByYearAndMonth(dataPoints) {
  return dataPoints.sort((a, b) => (
    (a.year === b.year) ? (a.month - b.month) : (a.year - b.year)));
}

/**
 * Sorts the data points by labels, ascending alphabetic order.
 *  -`labelIndex`: The index in the dataPoint array that contains the label
 *    to sort on
 */
function sortByLabel(dataPoints, labelKey) {
  return dataPoints.sort((a, b) => (a[labelKey].localeCompare(b[labelKey])));
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
  filterFacilities,
  filterMostRecentMonths,
  sortAndFilterMostRecentMonths,
  sortByLabel,
  sortByYearAndMonth,
};
