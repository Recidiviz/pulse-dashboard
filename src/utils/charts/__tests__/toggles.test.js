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
import tk from "timekeeper";
import * as toggleMethods from "../toggles";

describe("test for file toggles", () => {
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

  it("toggle label", () => {
    const labelsByToggle = { counts: "Referral count", rates: "Referral rate" };

    const toggleTest = toggleMethods.toggleLabel(labelsByToggle, "counts");
    expect(toggleTest).toBe("Referral count");

    const toggleEmptyTest = toggleMethods.toggleLabel({}, "");
    expect(toggleEmptyTest).toBe("No label found");
  });

  it("toggle Y axis ticks for", () => {
    const expectedToggleTicks = { min: 0, max: 110, stepSize: 10 };
    const expectedEmptyToggleTicks = {
      min: undefined,
      max: undefined,
      stepSize: undefined,
    };

    const toggleTicksTest = toggleMethods.toggleYAxisTicksFor(
      "counts",
      "counts",
      0,
      110,
      10
    );
    expect(toggleTicksTest).toEqual(expectedToggleTicks);

    const toggleTicksEmptyTest = toggleMethods.toggleYAxisTicksFor(
      "",
      "",
      undefined,
      undefined,
      undefined
    );
    expect(toggleTicksEmptyTest).toEqual(expectedEmptyToggleTicks);

    const toggleTicksNotEqualTest = toggleMethods.toggleYAxisTicksFor(
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

    const toggleTicksTestDisplayTrue = toggleMethods.toggleYAxisTicksBasedOnGoal(
      true,
      20,
      80,
      10,
      otherOptions
    );
    expect(toggleTicksTestDisplayTrue).toEqual(expectedToggleTicksDisplayTrue);

    const toggleTicksTestDisplayFalse = toggleMethods.toggleYAxisTicksBasedOnGoal(
      false,
      20,
      80,
      10,
      otherOptions
    );
    expect(toggleTicksTestDisplayFalse).toEqual(
      expectedToggleTicksDisplayFalse
    );

    const toggleTicksEmptyTestParams = toggleMethods.toggleYAxisTicksBasedOnGoal(
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

    const toggleTicksTest = toggleMethods.toggleYAxisTicksAdditionalOptions(
      "rates",
      "rates",
      -10,
      120,
      10,
      otherOptions
    );
    expect(toggleTicksTest).toEqual(expectedToggleTicks);

    const toggleTicksTestDifferentType = toggleMethods.toggleYAxisTicksAdditionalOptions(
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

    const toggleTicks = toggleMethods.toggleYAxisTicksStackedRateBasicCount(
      "counts",
      200
    );
    expect(toggleTicks).toEqual(expectedToggleTicks);

    const toggleDifferentTicks = toggleMethods.toggleYAxisTicksStackedRateBasicCount(
      "rates",
      200
    );
    expect(toggleDifferentTicks).toEqual(expectedDifferentToggleTicks);

    const toggleTicksEmptyParameters = toggleMethods.toggleYAxisTicksStackedRateBasicCount(
      undefined,
      undefined
    );
    expect(toggleTicksEmptyParameters).toEqual(
      expectedToggleTicksForEmptyParameters
    );
  });

  it("get month count from metric period months toggle", () => {
    const monthCount = toggleMethods.getMonthCountFromMetricPeriodMonthsToggle(
      "12"
    );
    expect(monthCount).toBe(12);

    const monthCountIncorrectNumber = toggleMethods.getMonthCountFromMetricPeriodMonthsToggle(
      "toggle number"
    );
    expect(monthCountIncorrectNumber).toBeNaN();

    const monthCountEmptyNumber = toggleMethods.getMonthCountFromMetricPeriodMonthsToggle(
      undefined
    );
    expect(monthCountEmptyNumber).toBeNaN();
  });

  it("get period label from metric period months toggle", () => {
    const testDate = new Date("2020-02-14T11:01:58.135Z");
    tk.freeze(testDate);

    const periodMonth = toggleMethods.getPeriodLabelFromMetricPeriodMonthsToggle(
      12
    );
    expect(periodMonth).toBe("3/1/2019 to present");

    const emptyPeriodMonth = toggleMethods.getPeriodLabelFromMetricPeriodMonthsToggle(
      undefined
    );
    expect(emptyPeriodMonth).toBe("Invalid date to present");

    const incorrectPeriodMonth = toggleMethods.getPeriodLabelFromMetricPeriodMonthsToggle(
      "period month"
    );
    expect(incorrectPeriodMonth).toBe("Invalid date to present");
  });

  it("get trailing label from metric period months toggle", () => {
    const periodMonth = toggleMethods.getTrailingLabelFromMetricPeriodMonthsToggle(
      5
    );
    expect(periodMonth).toBe("Last 0.4166666666666667 years");

    const emptyPeriodMonth = toggleMethods.getTrailingLabelFromMetricPeriodMonthsToggle(
      undefined
    );
    expect(emptyPeriodMonth).toBe("Last NaN years");

    const periodLastMonth = toggleMethods.getTrailingLabelFromMetricPeriodMonthsToggle(
      "12"
    );
    expect(periodLastMonth).toBe("Last 12 months");

    const periodCurrentMonth = toggleMethods.getTrailingLabelFromMetricPeriodMonthsToggle(
      "1"
    );
    expect(periodCurrentMonth).toBe("Current month");

    const period3Month = toggleMethods.getTrailingLabelFromMetricPeriodMonthsToggle(
      "3"
    );
    expect(period3Month).toBe("Last 3 months");

    const period6Month = toggleMethods.getTrailingLabelFromMetricPeriodMonthsToggle(
      "6"
    );
    expect(period6Month).toBe("Last 6 months");

    const period36Month = toggleMethods.getTrailingLabelFromMetricPeriodMonthsToggle(
      "36"
    );
    expect(period36Month).toBe("Last 3 years");
  });

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

    const standardToolTipCount = toggleMethods.standardTooltipForCountMetric(
      tooltip,
      data
    );
    expect(standardToolTipCount).toBe("Successful completions: 203");

    const tooltipMetricYLabel = toggleMethods.standardTooltipForCountMetric(
      tooltipYLabel,
      data
    );
    expect(tooltipMetricYLabel).toBe("Successful completions: 204");

    const tooltipEmptyMetric = toggleMethods.standardTooltipForCountMetric(
      tooltip,
      dataEmptyLabel
    );
    expect(tooltipEmptyMetric).toBe("203");
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

    const standardTooltip = toggleMethods.standardTooltipForRateMetric(
      tooltipItem,
      data
    );
    expect(standardTooltip).toBe("Success rate: 49.37%");

    const tooltipEmptyMetric = toggleMethods.standardTooltipForRateMetric(
      tooltipItem,
      dataEmptyLabel
    );
    expect(tooltipEmptyMetric).toBe(": 49.37%");
  });

  it("tooltip for rate metric with counts", () => {
    const tooltipWithCount = toggleMethods.tooltipForRateMetricWithCounts(
      id,
      tooltipItemRate,
      dataMetric,
      numbers,
      denominators
    );
    expect(tooltipWithCount).toBe("Percent revoked: 10.56% (19/180)");
  });

  it("tooltip for rate metric with nested counts", () => {
    const tooltipTest = toggleMethods.tooltipForRateMetricWithCounts(
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
    const tooltipTest = toggleMethods.tooltipForRateMetricWithCounts(
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
    const tooltipTest = toggleMethods.tooltipForRateMetricWithCounts(
      id,
      tooltipItemRate,
      dataMetric,
      [numbers],
      [denominators],
      includeWarning
    );
    expect(tooltipTest).toBe("Percent revoked: 10.56% (2/3)");
  });

  it("update tooltip for metric type", () => {
    const tooltipTest = toggleMethods.updateTooltipForMetricType(
      "rates",
      tooltipItemRate,
      dataForRates
    );
    expect(tooltipTest).toBe("Referral rate: 10.56%");

    const tooltipTestCounts = toggleMethods.updateTooltipForMetricType(
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

    const goalTest = toggleMethods.canDisplayGoal(goal, currentToggleStates);
    expect(goalTest).toBeTrue();

    const goalFalseTest = toggleMethods.canDisplayGoal(
      goal,
      currentToggleStatesGeoViewTrue
    );
    expect(goalFalseTest).toBe(false);
  });

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

    toggleMethods.centerSingleMonthDatasetIfNecessary(dataValues, labels);
    expect(dataValues).toBe(dataValues);
    expect(labels).toBe(labels);

    const dataOneValue = ["26"];
    const oneLabel = ["April '19"];
    const expectedDataOneValue = [null, "26", null];
    const expectedOneLabel = ["", "April '19", ""];

    toggleMethods.centerSingleMonthDatasetIfNecessary(dataOneValue, oneLabel);
    expect(dataOneValue).toEqual(expectedDataOneValue);
    expect(oneLabel).toEqual(expectedOneLabel);
  });
});
