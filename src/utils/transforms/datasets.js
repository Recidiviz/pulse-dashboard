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
/**
 * Sorts the data points by year and month, ascending.
 * Assumes that the the data is in the format:
 * [[year, month, data], [year, month, data], ...]
 */
export function sortByYearAndMonth(dataPoints) {
  return dataPoints.sort((a, b) =>
    Number(a.year) === Number(b.year)
      ? Number(a.month) - Number(b.month)
      : Number(a.year) - Number(b.year)
  );
}

/**
 * Sorts the data points by labels, ascending alphabetic order.
 *  -`labelIndex`: The index in the dataPoint array that contains the label
 *    to sort on
 */
export function sortByLabel(dataPoints, labelKey) {
  return dataPoints.sort((a, b) => a[labelKey].localeCompare(b[labelKey]));
}

export function filterMostRecentMonths(dataPoints, monthCount) {
  return dataPoints.slice(dataPoints.length - monthCount, dataPoints.length);
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
    const month = remainder === 0 ? 12 : remainder;

    const dateMonthsAgo = new Date(now.getTime());
    dateMonthsAgo.setMonth(i - 1);
    const year = dateMonthsAgo.getFullYear();

    if (dateMonthsAgo.getMonth() !== month - 1) {
      /* eslint-disable no-console */
      console.error(
        `Month mismatch: month=${month}, dateMonthsAgo=${dateMonthsAgo}`
      );
    }

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
export function sortFilterAndSupplementMostRecentMonths(
  unsortedDataPoints,
  monthCount,
  valueKey,
  emptyValue
) {
  const updatedDataPoints = addEmptyMonthsToData(
    unsortedDataPoints,
    monthCount,
    valueKey,
    emptyValue
  );
  const sortedData = sortByYearAndMonth(updatedDataPoints);
  return filterMostRecentMonths(sortedData, monthCount);
}
