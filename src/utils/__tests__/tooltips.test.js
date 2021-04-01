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
import {
  standardTooltipForCountMetric,
  tooltipWithoutTrendlineLabel,
} from "../tooltips";

describe("standardTooltipForCountMetric", () => {
  it("standard tooltip for count metric", () => {
    const tooltip = {
      xLabel: "May",
      yLabel: 203,
      label: "May",
      value: "203",
      index: 1,
      datasetIndex: 0,
      x: 116.05289450558749,
      y: 211.504,
    };

    const data = {
      labels: [
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
      ],
      datasets: [
        {
          label: "Successful completions",
          backgroundColor: "#809AE5",
          borderColor: "#809AE5",
          pointBackgroundColor: "#809AE5",
          pointHoverBackgroundColor: "#809AE5",
          pointHoverBorderColor: "#809AE5",
          pointRadius: 4,
          hitRadius: 5,
          fill: false,
          borderWidth: 2,
          lineTension: 0,
          data: [225, 203, 177, 158, 190, 200, 201, 143, 143, 284, 195, 420],
        },
      ],
    };

    const dataEmptyLabel = {
      labels: [
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
      ],
      datasets: [
        {
          label: "",
          backgroundColor: "#809AE5",
          borderColor: "#809AE5",
          pointBackgroundColor: "#809AE5",
          pointHoverBackgroundColor: "#809AE5",
          pointHoverBorderColor: "#809AE5",
          pointRadius: 4,
          hitRadius: 5,
          fill: false,
          borderWidth: 2,
          lineTension: 0,
          data: [225, 203, 177, 158, 190, 200, 201, 143, 143, 284, 195, 420],
        },
      ],
    };

    const tooltipYLabel = {
      xLabel: "May",
      yLabel: 204,
      label: "May",
      index: 1,
      datasetIndex: 0,
      x: 116.05289450558749,
      y: 211.504,
    };

    const standardToolTipCount = standardTooltipForCountMetric(tooltip, data);
    expect(standardToolTipCount).toBe("Successful completions: 203");

    const tooltipMetricYLabel = standardTooltipForCountMetric(
      tooltipYLabel,
      data
    );
    expect(tooltipMetricYLabel).toBe("Successful completions: 204");

    const tooltipEmptyMetric = standardTooltipForCountMetric(
      tooltip,
      dataEmptyLabel
    );
    expect(tooltipEmptyMetric).toBe("203");
  });

  it("get tooltip without trendline", () => {
    const tooltipItem = {
      datasetIndex: "test",
      yLabel: "Revocation count: ",
    };
    const data = {
      datasets: {
        test: {
          label: "test",
        },
      },
    };
    const units = 45;

    const tooltipItemTrendline = {
      datasetIndex: "trendline",
      yLabel: "Revocation count: ",
    };
    const dataForTrendline = {
      datasets: {
        trendline: {
          label: "trendline",
        },
      },
    };

    const tooltip = tooltipWithoutTrendlineLabel(tooltipItem, data, units);
    expect(tooltip).toBe("Revocation count: 45");

    const tooltipForTrendline = tooltipWithoutTrendlineLabel(
      tooltipItemTrendline,
      dataForTrendline,
      units
    );
    expect(tooltipForTrendline).toBe("");

    const tooltipEmptyYLabel = tooltipWithoutTrendlineLabel(
      tooltipItem,
      data,
      undefined
    );
    expect(tooltipEmptyYLabel).toBe("Revocation count: ");
  });
});
