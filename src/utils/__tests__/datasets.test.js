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
import tk from "timekeeper";

import {
  centerSingleMonthDatasetIfNecessary,
  filterMostRecentMonths,
  sortByYearAndMonth,
  sortFilterAndSupplementMostRecentMonths,
} from "../datasets";

const data = [
  { year: "2019", month: "5", count: 1702 },
  { year: "2017", month: "2", count: 2405 },
  { year: "2017", month: "10", count: 1701 },
  { year: "2017", month: "4", count: 1702 },
  { year: "2017", month: "7", count: 1709 },
  { year: "2018", month: "11", count: 1704 },
  { year: "2017", month: "9", count: 1707 },
];

const mountCount = 12;

describe("test datasets", () => {
  it("sort  data by year and month", () => {
    const sortData = sortByYearAndMonth(data);
    const sortingData = [
      { year: "2017", month: "2", count: 2405 },
      { year: "2017", month: "4", count: 1702 },
      { year: "2017", month: "7", count: 1709 },
      { year: "2017", month: "9", count: 1707 },
      { year: "2017", month: "10", count: 1701 },
      { year: "2018", month: "11", count: 1704 },
      { year: "2019", month: "5", count: 1702 },
    ];
    expect(sortData).toEqual(sortingData);
    expect(sortData.length).toEqual(sortingData.length);
    expect(sortData[0].year).toEqual(sortingData[0].year);
    expect(sortData[1].year).toEqual(sortingData[1].year);
  });

  it("filter most recent months", () => {
    const filtersData = [
      { year: "2019", month: "4", count: 1704 },
      { year: "2019", month: "5", count: 1702 },
      { year: "2019", month: "6", count: 1707 },
      { year: "2019", month: "7", count: 1701 },
      { year: "2019", month: "8", count: 1704 },
      { year: "2019", month: "9", count: 1702 },
      { year: "2019", month: "10", count: 1707 },
      { year: "2019", month: "11", count: 1701 },
      { year: "2019", month: "12", count: 1704 },
      { year: "2020", month: "1", count: 1702 },
      { year: "2020", month: "2", count: 1702 },
      { year: "2020", month: "3", count: 1702 },
    ];
    const dataForTest = [
      { year: "2019", month: "1", count: 1709 },
      { year: "2019", month: "2", count: 1707 },
      { year: "2019", month: "3", count: 1701 },
      { year: "2019", month: "4", count: 1704 },
      { year: "2019", month: "5", count: 1702 },
      { year: "2019", month: "6", count: 1707 },
      { year: "2019", month: "7", count: 1701 },
      { year: "2019", month: "8", count: 1704 },
      { year: "2019", month: "9", count: 1702 },
      { year: "2019", month: "10", count: 1707 },
      { year: "2019", month: "11", count: 1701 },
      { year: "2019", month: "12", count: 1704 },
      { year: "2020", month: "1", count: 1702 },
      { year: "2020", month: "2", count: 1702 },
      { year: "2020", month: "3", count: 1702 },
    ];

    const newData = filterMostRecentMonths(dataForTest, mountCount);
    expect(newData).toEqual(filtersData);
    expect(newData.length).toBe(12);
  });

  it("sort filter and supplement most recent months", () => {
    const emptyValue = 0;
    const valueKey = "count";
    const dataFiltersSupplementMostRecentMonth = [
      { year: "2019", month: "2", count: 0 },
      { year: "2019", month: "3", count: 0 },
      { year: "2019", month: "4", count: 0 },
      { year: "2019", month: "5", count: 1702 },
      { year: "2019", month: "6", count: 0 },
      { year: "2019", month: "7", count: 0 },
      { year: "2019", month: "8", count: 0 },
      { year: "2019", month: "9", count: 0 },
      { year: "2019", month: "10", count: 0 },
      { year: "2019", month: "11", count: 0 },
      { year: "2019", month: "12", count: 0 },
      { year: "2020", month: "1", count: 0 },
    ];

    const testDate = new Date("2020-01-14T11:01:58.135Z");
    tk.freeze(testDate);

    const dataAfterFiltersByMethod = sortFilterAndSupplementMostRecentMonths(
      data,
      mountCount,
      valueKey,
      emptyValue
    );
    expect(dataAfterFiltersByMethod).toEqual(
      dataFiltersSupplementMostRecentMonth
    );
  });

  describe("centerSingleMonthDatasetIfNecessary", () => {
    it("center single month dataset if necessary", () => {
      const dataValues = [
        "26",
        "49",
        "33",
        "41",
        "39",
        "23",
        "31",
        "46",
        "40",
        "94",
        "61",
        "43",
      ];
      const labels = [
        "April '19",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
        "January '20",
        "February",
        "March",
      ];

      centerSingleMonthDatasetIfNecessary(dataValues, labels);
      expect(dataValues).toBe(dataValues);
      expect(labels).toBe(labels);

      const dataOneValue = ["26"];
      const oneLabel = ["April '19"];
      const expectedDataOneValue = [null, "26", null];
      const expectedOneLabel = ["", "April '19", ""];

      centerSingleMonthDatasetIfNecessary(dataOneValue, oneLabel);
      expect(dataOneValue).toEqual(expectedDataOneValue);
      expect(oneLabel).toEqual(expectedOneLabel);
    });
  });
});
