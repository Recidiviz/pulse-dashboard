// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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
import { tooltipForRateMetricWithCounts } from "../tooltips";

describe("tooltipForRateMetricWithCounts", () => {
  const id = "revocationsByRace";
  const tooltipItemRate = {
    xLabel: "High",
    yLabel: 10.56,
    label: "High",
    value: "10.56",
    index: 3,
    datasetIndex: 0,
    x: 1088.744296760559,
    y: 249.0246857142857,
  };

  const dataMetric = {
    labels: ["No Score", "Low", "Moderate", "High", "Very High"],
    datasets: [
      {
        label: "Percent revoked",
        backgroundColor: "#F07132",
        hoverBackgroundColor: "#F07132",
        hoverBorderColor: "#F07132",
        data: ["6.53", "8.84", "13.48", "10.56", "66.67"],
      },
    ],
  };

  const numbers = [56, 26, 36, 19, 2];
  const denominators = [857, 294, 267, 180, 3];

  it("tooltip for rate metric with counts", () => {
    const tooltipWithCount = tooltipForRateMetricWithCounts(
      id,
      tooltipItemRate,
      dataMetric,
      numbers,
      denominators
    );
    expect(tooltipWithCount).toBe("Percent revoked: 10.56% (19/180)");
  });

  it("tooltip for rate metric with nested counts", () => {
    const tooltipTest = tooltipForRateMetricWithCounts(
      id,
      tooltipItemRate,
      dataMetric,
      [numbers],
      [denominators]
    );
    expect(tooltipTest).toBe("Percent revoked: 10.56% (19/180)");
  });

  it("tooltip for rate metric with warning", () => {
    const includeWarning = true;
    tooltipItemRate.index = 4;
    const tooltipTest = tooltipForRateMetricWithCounts(
      id,
      tooltipItemRate,
      dataMetric,
      [numbers],
      [denominators],
      includeWarning
    );
    expect(tooltipTest).toBe("Percent revoked: 10.56% (2/3) *");
  });

  it("tooltip for rate metric without warning", () => {
    const includeWarning = false;
    tooltipItemRate.index = 4;
    const tooltipTest = tooltipForRateMetricWithCounts(
      id,
      tooltipItemRate,
      dataMetric,
      [numbers],
      [denominators],
      includeWarning
    );
    expect(tooltipTest).toBe("Percent revoked: 10.56% (2/3)");
  });
});
