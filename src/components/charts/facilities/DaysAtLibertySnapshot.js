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

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";

import map from "lodash/fp/map";
import pipe from "lodash/fp/pipe";

import { COLORS } from "../../../assets/scripts/constants/colors";
import { configureDownloadButtons } from "../../../assets/scripts/utils/downloads";
import {
  getGoalForChart,
  getMinForGoalAndData,
  getMaxForGoalAndData,
  trendlineGoalText,
  chartAnnotationForGoal,
} from "../../../utils/charts/metricGoal";
import {
  getMonthCountFromMetricPeriodMonthsToggle,
  canDisplayGoal,
  centerSingleMonthDatasetIfNecessary,
} from "../../../utils/charts/toggles";
import {
  generateTrendlineDataset,
  getTooltipWithoutTrendline,
} from "../../../utils/charts/trendline";
import { sortFilterAndSupplementMostRecentMonths } from "../../../utils/transforms/datasets";
import { monthNamesWithYearsFromNumbers } from "../../../utils/transforms/months";

const chartId = "daysAtLibertySnapshot";
const stepSize = 200;

const DaysAtLibertySnapshot = ({
  stateCode,
  daysAtLibertyByMonth,
  metricPeriodMonths,
  disableGoal,
  header,
}) => {
  const goal = getGoalForChart(stateCode, chartId);
  const displayGoal = canDisplayGoal(goal, { disableGoal, metricPeriodMonths });

  const dataPoints = pipe(
    map(({ year, month, avg_liberty: average }) => ({
      year,
      month,
      average: parseFloat(average).toFixed(2),
    })),
    (dataset) =>
      sortFilterAndSupplementMostRecentMonths(
        dataset,
        getMonthCountFromMetricPeriodMonthsToggle(metricPeriodMonths),
        "average",
        "0.0"
      )
  )(daysAtLibertyByMonth);

  const chartDataValues = map("average", dataPoints);
  const min = getMinForGoalAndData(goal.value, chartDataValues, stepSize);
  const max = getMaxForGoalAndData(goal.value, chartDataValues, stepSize);
  const monthNames = monthNamesWithYearsFromNumbers(
    map("month", dataPoints),
    true
  );

  centerSingleMonthDatasetIfNecessary(chartDataValues, monthNames);

  const chartLabels = monthNames;
  const chartDataPoints = chartDataValues;
  const chartMinValue = min;
  const chartMaxValue = max;

  function goalLineIfApplicable() {
    if (displayGoal) {
      return chartAnnotationForGoal(goal, "daysAtLibertySnapshotGoalLine", {});
    }
    return null;
  }

  function datasetsWithTrendlineIfApplicable() {
    const datasets = [
      {
        label: "Days at liberty (average)",
        backgroundColor: COLORS["blue-standard"],
        borderColor: COLORS["blue-standard"],
        pointBackgroundColor: COLORS["blue-standard"],
        pointHoverBackgroundColor: COLORS["blue-standard"],
        pointHoverBorderColor: COLORS["blue-standard"],
        pointRadius: 4,
        hitRadius: 5,
        fill: false,
        borderWidth: 2,
        lineTension: 0,
        data: chartDataPoints,
      },
    ];
    if (displayGoal) {
      datasets.push(
        generateTrendlineDataset(chartDataPoints, COLORS["blue-standard-light"])
      );
    }
    return datasets;
  }

  const chart = (
    <Line
      id={chartId}
      data={{
        labels: chartLabels,
        datasets: datasetsWithTrendlineIfApplicable(),
      }}
      options={{
        legend: {
          display: false,
          position: "right",
          labels: {
            usePointStyle: true,
            boxWidth: 5,
          },
        },
        tooltips: {
          backgroundColor: COLORS["grey-800-light"],
          enabled: true,
          mode: "point",
          callbacks: {
            label: (tooltipItem, data) =>
              getTooltipWithoutTrendline(tooltipItem, data, " days"),
          },
        },
        scales: {
          xAxes: [
            {
              ticks: {
                fontColor: COLORS["grey-600"],
              },
              scaleLabel: {
                display: true,
                labelString: "Month of readmission",
                fontColor: COLORS["grey-500"],
                fontStyle: "bold",
              },
              gridLines: {
                color: "#FFF",
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                fontColor: COLORS["grey-600"],
                min: chartMinValue,
                max: chartMaxValue,
                stepSize,
              },
              scaleLabel: {
                display: true,
                labelString: "Number of days at liberty",
                fontColor: COLORS["grey-500"],
                fontStyle: "bold",
              },
              gridLines: {
                color: COLORS["grey-300"],
              },
            },
          ],
        },
        annotation: goalLineIfApplicable(),
      }}
    />
  );

  const exportedStructureCallback = function exportedStructureCallback() {
    return {
      metric: "Average days at liberty",
      series: [],
    };
  };

  useEffect(() => {
    configureDownloadButtons(
      chartId,
      "DAYS AT LIBERTY (AVERAGE)",
      chart.props.data.datasets,
      chart.props.data.labels,
      document.getElementById(chartId),
      exportedStructureCallback,
      {},
      true,
      true
    );
  }, [chart.props.data.datasets, chart.props.data.labels, metricPeriodMonths]);

  useEffect(() => {
    const headerElement = document.getElementById(header);

    if (headerElement && displayGoal) {
      const trendlineValues = chart.props.data.datasets[1].data;
      const trendlineText = trendlineGoalText(trendlineValues, goal);

      const title = `The average days between release from incarceration and readmission has been <span class='fs-block header-highlight'>trending ${trendlineText}.</span>`;
      headerElement.innerHTML = title;
    } else if (headerElement) {
      headerElement.innerHTML = "";
    }
  }, [chart.props.data.datasets, displayGoal, goal, header]);

  return chart;
};

DaysAtLibertySnapshot.defaultProps = {
  daysAtLibertyByMonth: [],
  disableGoal: false,
  header: undefined,
};

DaysAtLibertySnapshot.propTypes = {
  daysAtLibertyByMonth: PropTypes.arrayOf(PropTypes.shape({})),
  metricPeriodMonths: PropTypes.string.isRequired,
  disableGoal: PropTypes.bool,
  header: PropTypes.string,
  stateCode: PropTypes.string.isRequired,
};

export default DaysAtLibertySnapshot;
