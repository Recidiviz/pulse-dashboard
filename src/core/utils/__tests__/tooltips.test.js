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
import * as tooltipsUtils from "../tooltips";

describe("tooltips", () => {
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

  const tooltipItemCount = {
    xLabel: "February",
    yLabel: 49,
    label: "February",
    value: "49",
    index: 10,
    datasetIndex: 0,
    x: 633.9642396550939,
    y: 131.76141524482514,
  };

  const dataCount = {
    labels: [
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
    ],
    datasets: [
      {
        label: "Referral count",
        backgroundColor: "#9e9e9e",
        borderColor: "#9e9e9e",
        pointBackgroundColor: "#9e9e9e",
        pointHoverBackgroundColor: "#9e9e9e",
        pointHoverBorderColor: "#9e9e9e",
        fill: false,
        borderWidth: 2,
        data: [80, 53, 53, 71, 43, 29, 17, 25, 32, 72, 49, 90],
      },
    ],
  };

  const dataForRates = {
    labels: [
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
    ],
    datasets: [
      {
        label: "Referral rate",
        backgroundColor: "#9e9e9e",
        borderColor: "#9e9e9e",
        pointBackgroundColor: "#9e9e9e",
        pointHoverBackgroundColor: "#9e9e9e",
        pointHoverBorderColor: "#9e9e9e",
        fill: false,
        borderWidth: 2,
        data: [80, 53, 53, 71, 43, 29, 17, 25, 32, 72, 49, 90],
      },
    ],
  };

  describe("test for tooltips", () => {
    const tooltipItem = [
      {
        xLabel: "Black",
        yLabel: 107,
        label: "Black",
        value: "107",
        index: 2,
        datasetIndex: 0,
        x: 255.5001397650583,
        y: 185.55155917203672,
      },
      {
        xLabel: "Hispanic",
        yLabel: 152,
        label: "Hispanic",
        value: "152",
        index: 4,
        datasetIndex: 2,
        x: 375.09584281376425,
        y: 171.9262300611739,
      },
    ];

    const data = {
      labels: [
        "American Indian Alaskan Native",
        "Asian",
        "Black",
        "Hispanic",
        "Native Hawaiian Pacific Islander",
        "Other",
      ],
      datasets: [
        {
          label: "Referrals",
          backgroundColor: "#809AE5",
          hoverBackgroundColor: "#809AE5",
          yAxisID: "y-axis-left",
          data: [478, 0, 107, 0, 42, 52, 609],
        },
        {
          label: "Supervision Population",
          backgroundColor: "#3F4D62",
          hoverBackgroundColor: "#3F4D62",
          yAxisID: "y-axis-left",
          data: [301, 0, 71, 152, 31, 55, 559],
        },
        {
          label: "Population",
          backgroundColor: "#3F4D62",
          hoverBackgroundColor: "#3F4D62",
          yAxisID: "y-axis-left",
          data: [301, 0, 71, 152, 31, 55, 559],
        },
      ],
    };

    it("tooltip for count chart", () => {
      const firstDataset = [456, 789, 56, 789];
      const firstPrefix = "Referral";
      const secondDataset = [23, 50, 200, 89];
      const secondPrefix = "Supervision";

      const dataEmpty = {
        labels: { Referrals: "" },
        datasets: [],
      };
      const dataForFirstDataset = {
        labels: { Referrals: "test" },
        datasets: [
          {
            label: "Referral",
            data: {
              Referrals: 20.560109289617486,
            },
          },
        ],
      };

      const dataForSecondDataset = {
        labels: { Supervision: "test" },
        datasets: [
          {
            label: "Supervision",
            data: {
              Referrals: 20.560109289617486,
            },
          },
        ],
      };

      const callback = tooltipsUtils.tooltipForCountChart(
        firstDataset,
        firstPrefix,
        secondDataset,
        secondPrefix
      );
      const tooltipTitle = callback.title(tooltipItem, data);
      expect(tooltipTitle).toBe("Black");

      const tooltipLabelForFirstDataset = callback.label(
        tooltipItem[0],
        dataForFirstDataset
      );
      expect(tooltipLabelForFirstDataset).toBe("Referral: 56");

      const tooltipLabelForSecondDataset = callback.label(
        tooltipItem[0],
        dataForSecondDataset
      );
      expect(tooltipLabelForSecondDataset).toBe("Supervision: 200");

      const tooltipLabel = callback.label(tooltipItem[1], data);
      expect(tooltipLabel).toBe("Population: 0");

      const tooltipEmptyTitle = callback.title(tooltipItem, dataEmpty);
      expect(tooltipEmptyTitle).toBe(undefined);

      expect(() => {
        callback.label(tooltipItem[0], dataEmpty);
      }).toThrow();
    });

    it("tooltip for rate chart", () => {
      const dataWithEmptyLabel = {
        labels: { Referrals: "test" },
        datasets: [
          {
            label: "",
            data: {
              Referrals: "",
            },
          },
        ],
      };

      const callback = tooltipsUtils.tooltipForRateChart();

      const tooltipTitle = callback.title(tooltipItem, data);
      expect(tooltipTitle).toBe("Referrals");

      const labelTooltip = callback.label(tooltipItem[0], data);
      expect(labelTooltip).toBe("107.00% of Black");

      const tooltipEmptyTitle = callback.title(tooltipItem, dataWithEmptyLabel);
      expect(tooltipEmptyTitle).toBe("");
    });
  });

  it("toggle label", () => {
    const labelsByToggle = { counts: "Referral count", rates: "Referral rate" };

    const toggleTest = tooltipsUtils.toggleLabel(labelsByToggle, "counts");
    expect(toggleTest).toBe("Referral count");

    const toggleEmptyTest = tooltipsUtils.toggleLabel({}, "");
    expect(toggleEmptyTest).toBe("No label found");
  });

  it("toggle Y axis ticks for", () => {
    const expectedToggleTicks = { min: 0, max: 110, stepSize: 10 };
    const expectedEmptyToggleTicks = {
      min: undefined,
      max: undefined,
      stepSize: undefined,
    };

    const toggleTicksTest = tooltipsUtils.toggleYAxisTicksFor(
      "counts",
      "counts",
      0,
      110,
      10
    );
    expect(toggleTicksTest).toEqual(expectedToggleTicks);

    const toggleTicksEmptyTest = tooltipsUtils.toggleYAxisTicksFor(
      "",
      "",
      undefined,
      undefined,
      undefined
    );
    expect(toggleTicksEmptyTest).toEqual(expectedEmptyToggleTicks);

    const toggleTicksNotEqualTest = tooltipsUtils.toggleYAxisTicksFor(
      "counts",
      "rates",
      0,
      110,
      10
    );
    expect(toggleTicksNotEqualTest).toEqual(expectedEmptyToggleTicks);
  });

  it("toggle Y axis ticks based on goal", () => {
    const otherOptions = { fontColor: "#757575" };

    const expectedToggleTicksDisplayTrue = {
      fontColor: "#757575",
      min: 20,
      max: 80,
      stepSize: 10,
    };
    const expectedToggleTicksDisplayFalse = {
      fontColor: "#757575",
      min: undefined,
      max: undefined,
      stepSize: undefined,
    };

    const expectedEmptyToggleTicks = {
      min: undefined,
      max: undefined,
      stepSize: undefined,
    };

    const toggleTicksTestDisplayTrue = tooltipsUtils.toggleYAxisTicksBasedOnGoal(
      true,
      20,
      80,
      10,
      otherOptions
    );
    expect(toggleTicksTestDisplayTrue).toEqual(expectedToggleTicksDisplayTrue);

    const toggleTicksTestDisplayFalse = tooltipsUtils.toggleYAxisTicksBasedOnGoal(
      false,
      20,
      80,
      10,
      otherOptions
    );
    expect(toggleTicksTestDisplayFalse).toEqual(
      expectedToggleTicksDisplayFalse
    );

    const toggleTicksEmptyTestParams = tooltipsUtils.toggleYAxisTicksBasedOnGoal(
      undefined,
      0,
      0,
      0,
      {}
    );
    expect(toggleTicksEmptyTestParams).toEqual(expectedEmptyToggleTicks);
  });

  it("toggle YAxis ticks additional options", () => {
    const otherOptions = { fontColor: "#757575" };

    const expectedToggleTicks = {
      fontColor: "#757575",
      min: -10,
      max: 120,
      stepSize: 10,
    };
    const expectedIncorrectToggleTicks = {
      fontColor: "#757575",
      min: undefined,
      max: undefined,
      stepSize: undefined,
    };

    const toggleTicksTest = tooltipsUtils.toggleYAxisTicksAdditionalOptions(
      "rates",
      "rates",
      -10,
      120,
      10,
      otherOptions
    );
    expect(toggleTicksTest).toEqual(expectedToggleTicks);

    const toggleTicksTestDifferentType = tooltipsUtils.toggleYAxisTicksAdditionalOptions(
      "rates",
      "counts",
      -10,
      120,
      10,
      otherOptions
    );
    expect(toggleTicksTestDifferentType).toEqual(expectedIncorrectToggleTicks);
  });

  it("toggle YAxis ticks stacked rate basic count", () => {
    const expectedToggleTicks = { min: 0, max: 200, stepSize: undefined };
    const expectedToggleTicksForEmptyParameters = {
      min: 0,
      max: undefined,
      stepSize: undefined,
    };

    const expectedDifferentToggleTicks = { min: 0, max: 100, stepSize: 20 };

    const toggleTicks = tooltipsUtils.toggleYAxisTicksStackedRateBasicCount(
      "counts",
      200
    );
    expect(toggleTicks).toEqual(expectedToggleTicks);

    const toggleDifferentTicks = tooltipsUtils.toggleYAxisTicksStackedRateBasicCount(
      "rates",
      200
    );
    expect(toggleDifferentTicks).toEqual(expectedDifferentToggleTicks);

    const toggleTicksEmptyParameters = tooltipsUtils.toggleYAxisTicksStackedRateBasicCount(
      undefined,
      undefined
    );
    expect(toggleTicksEmptyParameters).toEqual(
      expectedToggleTicksForEmptyParameters
    );
  });

  it("standard tooltip for rate metric", () => {
    const tooltipItem = {
      xLabel: "Feb",
      yLabel: 49.37,
      label: "Feb",
      value: "49.37",
      index: 1,
      datasetIndex: 0,
      x: 369.2573239326477,
      y: 203.19093333333333,
    };

    const data = {
      labels: ["Jan '20", "Feb", "Mar"],
      datasets: [
        {
          label: "Success rate",
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
          data: ["52.21", "49.37", "63.64"],
        },
      ],
    };

    const dataEmptyLabel = {
      labels: ["Jan '20", "Feb", "Mar"],
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
          data: ["52.21", "49.37", "63.64"],
        },
      ],
    };

    const standardTooltip = tooltipsUtils.standardTooltipForRateMetric(
      tooltipItem,
      data
    );
    expect(standardTooltip).toBe("Success rate: 49.37%");

    const tooltipEmptyMetric = tooltipsUtils.standardTooltipForRateMetric(
      tooltipItem,
      dataEmptyLabel
    );
    expect(tooltipEmptyMetric).toBe(": 49.37%");
  });

  it("update tooltip for metric type", () => {
    const tooltipTest = tooltipsUtils.updateTooltipForMetricType(
      "rates",
      tooltipItemRate,
      dataForRates
    );
    expect(tooltipTest).toBe("Referral rate: 10.56%");

    const tooltipTestCounts = tooltipsUtils.updateTooltipForMetricType(
      "counts",
      tooltipItemCount,
      dataCount
    );
    expect(tooltipTestCounts).toBe("Referral count: 49");
  });

  it("can display goal", () => {
    const goal = {
      isUpward: false,
      value: 30,
      label: "30",
      metricType: "counts",
    };

    const currentToggleStates = {
      metricType: "counts",
      metricPeriodMonths: "12",
      supervisionType: "all",
      district: ["all"],
      geoView: false,
    };

    const currentToggleStatesGeoViewTrue = {
      metricType: "counts",
      metricPeriodMonths: "12",
      supervisionType: "all",
      district: ["all"],
      geoView: true,
    };

    const goalTest = tooltipsUtils.canDisplayGoal(goal, currentToggleStates);
    expect(goalTest).toBeTrue();

    const goalFalseTest = tooltipsUtils.canDisplayGoal(
      goal,
      currentToggleStatesGeoViewTrue
    );
    expect(goalFalseTest).toBe(false);
  });
});
