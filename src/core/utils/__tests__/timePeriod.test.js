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
import { monthNamesWithYearsFromNumbers, getYearFromNow } from "../timePeriod";

describe("timePeriod", () => {
  describe("#getYearFromNow", () => {
    let now;
    beforeAll(() => {
      now = new Date("2020-02-14T11:01:58.135Z");
      tk.freeze(now);
    });

    it("get last year", () => {
      expect(getYearFromNow(-1)).toEqual("2019");
    });

    it("get year before last", () => {
      expect(getYearFromNow(-2)).toEqual("2018");
    });
  });

  describe("monthNamesWithYearsFromNumbers", () => {
    it("month names with years from numbers", () => {
      const dataExpected = [
        "Apr '19",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
        "Jan '20",
        "Feb",
        "Mar",
      ];

      const dataExpectedLongArray = [
        "Apr '19",
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
        "Jan '20",
        "Feb",
        "Mar",
      ];

      const dataExpectedDifferentOrderArray = [
        "Jun '19",
        "Aug",
        "Apr",
        "Jul",
        "May",
        "Sep",
        "Oct",
        "Jan '20",
        "Dec",
        "Nov",
        "Feb",
        "Mar",
      ];

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
      const monthNumbersOutOfOrder = [
        "6",
        "8",
        "4",
        "7",
        "5",
        "9",
        "10",
        "1",
        "12",
        "11",
        "2",
        "3",
      ];

      const monthNamesWithYears = monthNamesWithYearsFromNumbers(
        monthNumbers,
        true
      );
      expect(monthNamesWithYears).toEqual(dataExpected);

      const monthNamesWithYearsEmptyArray = monthNamesWithYearsFromNumbers(
        [],
        undefined
      );
      expect(monthNamesWithYearsEmptyArray).toEqual([]);

      const monthNamesWithYearsLongArray = monthNamesWithYearsFromNumbers(
        monthNumbersWithInvalidEntries,
        true
      );
      expect(monthNamesWithYearsLongArray).toEqual(dataExpectedLongArray);

      const monthNamesWithYearsDifferentOrderArray = monthNamesWithYearsFromNumbers(
        monthNumbersOutOfOrder,
        true
      );
      expect(monthNamesWithYearsDifferentOrderArray).toEqual(
        dataExpectedDifferentOrderArray
      );
    });
  });
});
