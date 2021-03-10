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
import * as currentSpanMethods from "../currentSpan";

describe("test for currentSpan", () => {
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

  it("get current month name", () => {
    const testDate = new Date("2020-02-14T11:01:58.135Z");
    tk.freeze(testDate);

    const currentMonthName = currentSpanMethods.getCurrentMonthName();
    expect(currentMonthName).toEqual("February");
  });

  it("current month box", () => {
    const testDate = new Date("2020-03-14T11:01:58.135Z");
    tk.freeze(testDate);

    const annotationId = "currentMonthBoxRevocationsOverTime";
    const chartLabels = ["January '20", "February '20", "March '20"];
    const smallChartLabels = ["January '20"];

    const { drawTime, annotations } = currentSpanMethods.currentMonthBox(
      annotationId,
      chartLabels
    );
    expect(drawTime).toBe("beforeDatasetsDraw");
    expect(annotations[0].type).toBe("box");
    expect(annotations[0].id).toBe("currentMonthBoxRevocationsOverTime");
    expect(annotations[0].xScaleID).toBe("x-axis-0");
    expect(annotations[0].drawTime).toBe("beforeDatasetsDraw");
    expect(annotations[0].borderColor).toBe("#e0e0e0");
    expect(annotations[0].borderWidth).toBe(1);
    expect(annotations[0].backgroundColor).toBe("rgba(2, 191, 240, 0.1)");
    expect(annotations[0].xMin).toBe("February '20");

    const smallCurrentMonthBox = currentSpanMethods.currentMonthBox(
      annotationId,
      smallChartLabels
    );
    expect(smallCurrentMonthBox).toBe(null);

    const dateForTest = new Date("2020-01-14T11:01:58.135Z");
    tk.freeze(dateForTest);

    const currentMonthBoxForDifferentDate = currentSpanMethods.currentMonthBox(
      annotationId,
      smallChartLabels
    );
    expect(currentMonthBoxForDifferentDate).toBe(null);
  });

  it("month names all with years from numbers", () => {
    const dataExpected = [
      "Apr '19",
      "May '19",
      "Jun '19",
      "Jul '19",
      "Aug '19",
      "Sep '19",
      "Oct '19",
      "Nov '19",
      "Dec '19",
      "Jan '20",
      "Feb '20",
      "Mar '20",
    ];

    const expectedForDifferentOrder = [
      "Jun '19",
      "Aug '19",
      "Apr '19",
      "Jul '19",
      "May '19",
      "Sep '19",
      "Oct '19",
      "Jan '20",
      "Dec '20",
      "Nov '20",
      "Feb '20",
      "Mar '20",
    ];

    const expectedForLongArray = [
      "Apr '19",
      "May '19",
      "Jun '19",
      "Jul '19",
      "Aug '19",
      "Sep '19",
      "Oct '19",
      "Nov '19",
      "Dec '19",
      "Jan '20",
      "Feb '20",
      "Mar '20",
      "Apr '20",
    ];

    const longArray = [
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
      "4",
    ];

    const monthNamesWithYears = currentSpanMethods.monthNamesAllWithYearsFromNumbers(
      monthNumbers,
      true
    );
    expect(monthNamesWithYears).toEqual(dataExpected);

    const monthNamesWithYearsDifferentOrderArray = currentSpanMethods.monthNamesAllWithYearsFromNumbers(
      monthNumbersOutOfOrder,
      true
    );
    expect(monthNamesWithYearsDifferentOrderArray).toEqual(
      expectedForDifferentOrder
    );

    const monthNamesWithYearsEmptyArray = currentSpanMethods.monthNamesAllWithYearsFromNumbers(
      [],
      undefined
    );
    expect(monthNamesWithYearsEmptyArray).toEqual([]);

    const monthNamesWithYearsSmallArray = currentSpanMethods.monthNamesAllWithYearsFromNumbers(
      longArray,
      true
    );
    expect(monthNamesWithYearsSmallArray).toEqual(expectedForLongArray);
  });

  it("month names all with years from wrong numbers", () => {
    const testData = ["4", "5", "6", "7", "13", "-1", "2", "3", "4"];
    expect(() => {
      currentSpanMethods.monthNamesAllWithYearsFromNumbers(
        testData,
        true,
        false
      );
    }).toThrow();
  });
});
