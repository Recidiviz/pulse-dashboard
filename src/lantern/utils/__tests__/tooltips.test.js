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
  let tooltipItemRate;
  let numbers;
  let denominators;
  let dataMetric;

  const id = "  admissionsByDistrict";

  beforeEach(() => {
    tooltipItemRate = {
      xLabel: "High",
      yLabel: 10.56,
      label: "High",
      value: "10.56",
      index: 3,
      datasetIndex: 0,
      x: 1088.744296760559,
      y: 249.0246857142857,
    };

    dataMetric = {
      labels: ["No Score", "Low", "Moderate", "High", "Very High"],
      datasets: [
        {
          label: "Percent of standing population revoked",
          backgroundColor: "#F07132",
          hoverBackgroundColor: "#F07132",
          hoverBorderColor: "#F07132",
          data: ["6.53", "8.84", "13.48", "10.56", "66.67"],
        },
      ],
    };

    numbers = [56, 26, 36, 19, 2];
    denominators = [857, 294, 267, 180, 3];
  });

  it("tooltip for rate metric with counts", () => {
    const tooltipWithCount = tooltipForRateMetricWithCounts(
      id,
      tooltipItemRate,
      dataMetric,
      numbers,
      denominators
    );
    expect(tooltipWithCount).toBe(
      "Percent of standing population revoked: 10.56% (19/180)"
    );
  });

  it("tooltip for rate metric with nested counts", () => {
    const tooltipTest = tooltipForRateMetricWithCounts(
      id,
      tooltipItemRate,
      dataMetric,
      [numbers],
      [denominators]
    );
    expect(tooltipTest).toBe(
      "Percent of standing population revoked: 10.56% (19/180)"
    );
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
    expect(tooltipTest).toBe(
      "Percent of standing population revoked: 10.56% (2/3) *"
    );
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
    expect(tooltipTest).toBe(
      "Percent of standing population revoked: 10.56% (2/3)"
    );
  });

  describe("for Race and Gender charts", () => {
    beforeEach(() => {
      tooltipItemRate = {
        yLabel: "Admitted Population",
        xLabel: 10.56,
        label: "Admitted Population",
        value: "10.56",
        index: 0,
        datasetIndex: 0,
        x: 1088.744296760559,
        y: 249.0246857142857,
      };

      dataMetric = {
        labels: [
          "Admitted Population",
          "Recommended for Revocation",
          "Supervision Population",
          "Missouri Population",
        ],
        datasets: [
          {
            label: "Male",
            backgroundColor: "#F07132",
            hoverBackgroundColor: "#F07132",
            hoverBorderColor: "#F07132",
            data: ["6.53", "8.84", "13.48", "10.56"],
          },
        ],
      };

      numbers = [56, 26, 36, 19];
      denominators = [857, 294, 267, 180];
    });

    [
      "admissionsByRace",
      "admissionsByGender",
      "recommitmentsByRace",
      "recommitmentsBySex",
    ].forEach((metricId) => {
      it(`tooltip for rate metric with counts without trendline - ${metricId}`, () => {
        const includeWarning = false;
        const includePercentage = false;
        const tooltipWithCount = tooltipForRateMetricWithCounts(
          metricId,
          tooltipItemRate,
          dataMetric,
          numbers,
          denominators,
          includeWarning,
          includePercentage
        );
        expect(tooltipWithCount).toBe("Admitted Population (56/857)");
      });

      describe("when the tooltip should include a percentage", () => {
        it(`formats the tooltip correctly - ${metricId}`, () => {
          const includeWarning = false;
          const includePercentage = true;
          const tooltipWithCount = tooltipForRateMetricWithCounts(
            metricId,
            tooltipItemRate,
            dataMetric,
            numbers,
            denominators,
            includeWarning,
            includePercentage
          );
          expect(tooltipWithCount).toBe("Admitted Population 7% (56/857)");
        });

        it(`handles an undefined denominator`, () => {
          const includeWarning = false;
          const includePercentage = true;
          denominators[0] = undefined;
          const tooltipWithCount = tooltipForRateMetricWithCounts(
            metricId,
            tooltipItemRate,
            dataMetric,
            numbers,
            denominators,
            includeWarning,
            includePercentage
          );
          expect(tooltipWithCount).toBe("Admitted Population");
        });

        it(`handles a 0 denominator`, () => {
          const includeWarning = false;
          const includePercentage = true;
          denominators[0] = 0;
          const tooltipWithCount = tooltipForRateMetricWithCounts(
            metricId,
            tooltipItemRate,
            dataMetric,
            numbers,
            denominators,
            includeWarning,
            includePercentage
          );
          expect(tooltipWithCount).toBe("Admitted Population");
        });
      });
    });
  });
});
