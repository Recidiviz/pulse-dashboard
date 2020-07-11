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

import filter from "lodash/fp/filter";
import orderBy from "lodash/fp/orderBy";
import pipe from "lodash/fp/pipe";
import sumBy from "lodash/fp/sumBy";
import toInteger from "lodash/fp/toInteger";

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
export const groupByDistrictCreator = (fieldKey, records) =>
  records.reduce(
    (result, { district, [fieldKey]: field }) =>
      district === "ALL"
        ? result
        : {
            ...result,
            [district]: (result[district] || 0) + (toInteger(field) || 0),
          },
    {}
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

export const sortByMode = (mode) => {
  switch (mode) {
    case "counts":
    default:
      return orderBy(["count"], ["desc"]);
    case "rates":
      return orderBy(["rate"], ["desc"]);
    case "exits":
      return orderBy(["exit"], ["desc"]);
  }
};

/**
 * Sum population of revocation data
 *
 * @param {(string|number)} key
 * @param {Array} data
 * @returns {number}
 */
export const sumCounts = (key, data) =>
  pipe(
    filter((item) => item.district === "ALL"),
    sumBy((item) => toInteger(item[key]))
  )(data);

/**
 * Calculates avarage rate
 */
export const calculateAverageRate = (numerator, denominator) =>
  denominator === 0 || numerator === 0 ? 0 : (100 * numerator) / denominator;

export const getAverageRateAnnotation = (averageRate) => ({
  drawTime: "afterDatasetsDraw",
  annotations: [
    {
      drawTime: "afterDraw",
      type: "line",
      mode: "horizontal",
      scaleID: "y-axis-0",
      value: averageRate,
      borderColor: "#72777a",
      borderWidth: 2,
      label: {
        backgroundColor: "transparent",
        fontColor: "#72777a",
        fontStyle: "normal",
        enabled: true,
        content: `Overall: ${averageRate.toFixed(2)}%`,
        position: "right",
        yAdjust: -10,
      },
    },
  ],
});
