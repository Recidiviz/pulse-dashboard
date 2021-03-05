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
import * as monthMethods from "../months";

describe("test for file months", () => {
  const monthNumbers = [
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "1",
    "2",
    "3",
  ];
  const monthNumbersWithInvalidEntries = [
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "-5",
    "1",
    "2",
    "3",
  ];

  it("month names from numbers", () => {
    const expectedForAbbreviated = [
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
    ];

    const expectedMonthNames = [
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
      "January",
      "February",
      "March",
    ];

    const expectedForWrongNumbers = [
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      undefined,
      undefined,
      "Jan",
      "Feb",
      "Mar",
    ];

    const monthNamesWithAbbreviated = monthMethods.monthNamesFromNumbers(
      monthNumbers,
      true
    );
    expect(monthNamesWithAbbreviated).toEqual(expectedForAbbreviated);

    const monthNamesWithoutAbbreviated = monthMethods.monthNamesFromNumbers(
      monthNumbers,
      false
    );
    expect(monthNamesWithoutAbbreviated).toEqual(expectedMonthNames);

    const monthNamesEmptyArray = monthMethods.monthNamesFromNumbers(
      [],
      undefined
    );
    expect(monthNamesEmptyArray).toEqual([]);

    const monthNamesWrongNumber = monthMethods.monthNamesFromNumbers(
      monthNumbersWithInvalidEntries,
      true
    );
    expect(monthNamesWrongNumber).toEqual(expectedForWrongNumbers);
  });
});
