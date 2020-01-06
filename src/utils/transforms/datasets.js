// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2019 Recidiviz, Inc.
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
  const facilityArray = (facilityType === 'TRANSITIONAL'
    ? TRANSITIONAL_FACILITY_FILTERS[stateCode] : RELEASE_FACILITY_FILTERS[stateCode]);

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

/**
 * Returns a new list of data points consisting of the given data points and new
 * data points appended for any month in the last `monthCount` number of months
 * that is missing data, where the value for the `valueKey` property is `emptyValue`.
 */
function addEmptyMonthsToData(dataPoints, monthCount, valueKey, emptyValue) {
  const now = new Date();
  const thisMonth = now.getMonth() + 1;

  const representedMonths = {};
  dataPoints.forEach((monthData) => {
    if (!representedMonths[monthData.year]) {
      representedMonths[monthData.year] = {};
    }
    representedMonths[monthData.year][monthData.month] = true;
  });

  const newDataPoints = [...dataPoints];
  for (let i = thisMonth - (monthCount - 1); i <= thisMonth; i += 1) {
    // This bizarre math avoids a JS quirk with modulo operations on negative numbers.
    // https://web.archive.org/web/20090717035140if_/javascript.about.com/od/problemsolving/a/modulobug.htm
    const remainder = ((i % 12) + 12) % 12;
    const month = (remainder === 0) ? 12 : remainder;

    const monthsAgo = new Date(now.getTime());
    monthsAgo.setMonth(now.getMonth() + i - 1);
    const year = monthsAgo.getFullYear();

    if (!representedMonths[year] || !representedMonths[year][month]) {
      const monthData = {
        year: year.toString(),
        month: month.toString(),
      };
      monthData[valueKey] = emptyValue;
      newDataPoints.push(monthData);
    }
  }

  return newDataPoints;
}

/**
 * Sorts the data points by year and month, ascending, and then returns the
 * most recent `monthCount` number of months. Adds empty data for any months
 * that are missing.
 */
function sortFilterAndSupplementMostRecentMonths(
  unsortedDataPoints, monthCount, valueKey, emptyValue,
) {
  const updatedDataPoints = addEmptyMonthsToData(
    unsortedDataPoints, monthCount, valueKey, emptyValue,
  );
  const sortedData = sortByYearAndMonth(updatedDataPoints);
  return filterMostRecentMonths(sortedData, monthCount);
}

export {
  filterFacilities,
  filterMostRecentMonths,
  sortFilterAndSupplementMostRecentMonths,
  sortAndFilterMostRecentMonths,
  sortByLabel,
  sortByYearAndMonth,
};
