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

import map from "lodash/fp/map";
import pipe from "lodash/fp/pipe";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { Line } from "react-chartjs-2";

import { COLORS, CORE_COLORS } from "../../assets/scripts/constants/colors";
import { toNumber } from "../../utils";
import {
  centerSingleMonthDatasetIfNecessary,
  sortFilterAndSupplementMostRecentMonths,
} from "../../utils/datasets";
import { tooltipWithoutTrendlineLabel } from "../../utils/tooltips";
import { generateTrendlineDataset } from "../../utils/trendline";
import { configureDownloadButtons } from "../utils/configureDownloadButtons";
import {
  chartAnnotationForGoal,
  getGoalForChart,
  getMaxForGoalAndData,
  getMinForGoalAndData,
  trendlineGoalText,
} from "../utils/metricGoal";
import { monthNamesWithYearsFromNumbers } from "../utils/timePeriod";
import { canDisplayGoal } from "../utils/tooltips";

const chartId = "daysAtLibertySnapshot";
const stepSize = 200;

const DaysAtLibertySnapshot = ({
  stateCode,
  daysAtLibertyByMonth,
  metricPeriodMonths,
  disableGoal = false,
  header = null,
  getTokenSilently,
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
        toNumber(metricPeriodMonths),
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
        backgroundColor: CORE_COLORS.indigo.main,
        borderColor: CORE_COLORS.indigo.main,
        pointBackgroundColor: CORE_COLORS.indigo.main,
        pointHoverBackgroundColor: CORE_COLORS.indigo.main,
        pointHoverBorderColor: CORE_COLORS.indigo.main,
        fill: false,
        borderWidth: 2,
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
        plugins: {
          datalabels: {
            display: false,
          },
        },
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
              tooltipWithoutTrendlineLabel(tooltipItem, data, " days"),
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
                display: false,
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

  useEffect(() => {
    configureDownloadButtons({
      chartId,
      chartTitle: "DAYS AT LIBERTY (AVERAGE)",
      chartDatasets: chart.props.data.datasets,
      chartLabels: chart.props.data.labels,
      chartBox: document.getElementById(chartId),
      filters: {},
      convertValuesToNumbers: true,
      handleTimeStringLabels: true,
      getTokenSilently,
    });
  }, [
    getTokenSilently,
    chart.props.data.datasets,
    chart.props.data.labels,
    metricPeriodMonths,
  ]);

  useEffect(() => {
    const headerElement = header && document.getElementById(header);

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
  disableGoal: false,
  header: null,
};

DaysAtLibertySnapshot.propTypes = {
  daysAtLibertyByMonth: PropTypes.arrayOf(
    PropTypes.shape({
      avg_liberty: PropTypes.string.isRequired,
      month: PropTypes.string.isRequired,
      returns: PropTypes.string.isRequired,
      state_code: PropTypes.string.isRequired,
      year: PropTypes.string.isRequired,
    })
  ).isRequired,
  metricPeriodMonths: PropTypes.string.isRequired,
  stateCode: PropTypes.string.isRequired,
  disableGoal: PropTypes.bool,
  header: PropTypes.string,
};

export default DaysAtLibertySnapshot;
