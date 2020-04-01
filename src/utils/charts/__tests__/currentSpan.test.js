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

import "@testing-library/jest-dom/extend-expect";
import tk from "timekeeper";
import * as currentSpanMethods from "../currentSpan";

describe("test for currentSpan", () => {
  it("label current month", () => {
    const testDate = new Date("2020-03-14T11:01:58.135Z");
    tk.freeze(testDate);

    const tooltipItem = [
      {
        xLabel: "May '19",
        yLabel: 1194,
        label: "May '19",
        value: "1194",
        index: 1,
        datasetIndex: 0,
        x: 222.80880598588425,
        y: 27.129714285714286,
      },
    ];

    const labels = [
      "April '19",
      "May '19",
      "June '19",
      "July '19",
      "August '19",
      "September '19",
      "October '19",
      "November '19",
      "December '19",
      "January '20",
      "February '20",
      "March '20",
    ];

    const tooltipItemCurrentMonth = [
      {
        xLabel: "March '20",
        yLabel: 0,
        label: "March '20",
        value: "0",
        index: 11,
        datasetIndex: 0,
        x: 1792.943748474121,
        y: 149.6,
      },
    ];
    const label = currentSpanMethods.labelCurrentMonth(tooltipItem, labels);
    expect(label).toBe("May '19");

    const labelCurrentMonth = currentSpanMethods.labelCurrentMonth(
      tooltipItemCurrentMonth,
      labels
    );
    expect(labelCurrentMonth).toBe("March '20 (in progress)");
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
    expect(annotations[0].backgroundColor).toBe("rgba(224, 224, 224, 0.5)");
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
});
