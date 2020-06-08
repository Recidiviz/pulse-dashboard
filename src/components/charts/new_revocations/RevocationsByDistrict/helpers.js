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

import orderBy from "lodash/fp/orderBy";

/**
 * Creator function for grouping data by district.
 * Need to exclude district=ALL data because it is not needed for charts.
 *
 * @param {string} fieldKey Key of original record field.
 * @returns {function} Unary function (argument - array of data)
 *
 * @example
 * groupByDistrict("some_field") // (records) => { '01' => 5, '02' => 3 }
 */
const groupByDistrictCreator = (fieldKey) => (records) =>
  records.reduce(
    (result, { district, [fieldKey]: field }) =>
      district === "ALL"
        ? result
        : {
            ...result,
            [district]: (result[district] || 0) + (parseInt(field, 10) || 0),
          },
    {}
  );

export const groupRevocationDataByDistrict = groupByDistrictCreator(
  "population_count"
);
export const groupSupervisionDataByDistrict = groupByDistrictCreator(
  "total_population"
);

/**
 * Form maximally described data for chart from revocation and supervision data.
 *
 * @param {RevocationRecord} revocationGroupedData
 * @param {SupervisionRecord} supervisionGroupedData
 * @returns {{ district: string, count: number, total: number, rate: number }[]}
 */
export const mergeRevocationData = (
  revocationGroupedData,
  supervisionGroupedData
) =>
  Object.entries(revocationGroupedData).map(([district, count]) => {
    const total = supervisionGroupedData[district];
    const rate = total === 0 || count === 0 ? 0 : (100 * count) / total;
    return { district, count, total, rate };
  });

export const sortByCount = orderBy(["count"], ["desc"]);
export const sortByRate = orderBy(["rate"], ["desc"]);

/**
 * Sum population of revocation data
 *
 * @param {(string|number)} key
 * @param {Array} data
 * @returns {number}
 */
const sumPopulation = (key, data) =>
  data.reduce((acc, item) => {
    if (item.district === "ALL") {
      return acc + (parseInt(item[key], 10) || 0);
    }
    return acc;
  }, 0);

/**
 * Calculates avarage rate of revocation population.
 */
export const calculateAverageRate = (revocationData, supervisionData) => {
  const numerator = sumPopulation("population_count", revocationData);
  const denominator = sumPopulation("total_population", supervisionData);
  return denominator === 0 || numerator === 0
    ? 0
    : (100 * numerator) / denominator;
};
