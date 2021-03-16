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

import groupBy from "lodash/fp/groupBy";
import filter from "lodash/fp/filter";
import map from "lodash/fp/map";
import pipe from "lodash/fp/pipe";
import sumBy from "lodash/fp/sumBy";
import toInteger from "lodash/fp/toInteger";
import values from "lodash/fp/values";

import { COLORS, CORE_COLORS } from "../../assets/scripts/constants/colors";
import { configureDownloadButtons } from "../utils/configureDownloadButtons";
import {
  sortFilterAndSupplementMostRecentMonths,
  centerSingleMonthDatasetIfNecessary,
} from "../../utils/datasets";
import { monthNamesWithYearsFromNumbers } from "../utils/timePeriod";
import {
  filterDatasetBySupervisionType,
  filterDatasetByDistrict,
} from "../utils/dataFilters";
import {
  getGoalForChart,
  getMinForGoalAndData,
  getMaxForGoalAndData,
  trendlineGoalText,
  chartAnnotationForGoal,
} from "../utils/metricGoal";
import {
  toggleYAxisTicksAdditionalOptions,
  toggleLabel,
  updateTooltipForMetricType,
  canDisplayGoal,
} from "../utils/tooltips";
import { toNumber } from "../../utils";
import { generateTrendlineDataset } from "../../utils/trendline";
import { METRIC_TYPES } from "../utils/constants";
import { metricTypePropType } from "../utils/propTypes";

const chartId = "supervisionSuccessSnapshot";

const isValidData = ({ month, year }) => {
  const today = new Date();
  const yearNow = today.getFullYear();
  const monthNow = today.getMonth() + 1;

  const currentYear = toInteger(year);
  const currentMonth = toInteger(month);

  return (
    currentYear < yearNow ||
    (currentYear === yearNow && currentMonth <= monthNow)
  );
};

const groupByMonthAndMap = pipe(
  groupBy(
    ({ projected_year: year, projected_month: month }) => `${year}-${month}`
  ),
  values,
  map((dataset) => ({
    year: toInteger(dataset[0].projected_year),
    month: toInteger(dataset[0].projected_month),
    successful: sumBy(
      (data) => toInteger(data.successful_termination),
      dataset
    ),
    revocation: sumBy(
      (data) => toInteger(data.revocation_termination),
      dataset
    ),
  }))
);

const dataCountsMapper = ({ year, month, successful }) => {
  return { year, month, value: successful };
};

const dataRatesMapper = ({ year, month, successful, revocation }) => {
  const successRate =
    successful + revocation !== 0
      ? (100 * (successful / (successful + revocation))).toFixed(2)
      : 0.0;

  return { year, month, value: successRate };
};

const SupervisionSuccessSnapshot = ({
  supervisionSuccessRates: countsByMonth,
  stateCode,
  supervisionType,
  district,
  metricType,
  metricPeriodMonths,
  header = null,
  disableGoal = false,
  getTokenSilently,
}) => {
  const stepSize = 10;

  const goal = getGoalForChart(stateCode, chartId);
  const displayGoal = canDisplayGoal(goal, {
    disableGoal,
    metricType,
    supervisionType,
    district,
  });

  const dataPoints = pipe(
    (dataset) => filterDatasetBySupervisionType(dataset, supervisionType),
    (dataset) => filterDatasetByDistrict(dataset, district),
    // Don't add completion rates for months in the future
    filter(isValidData),
    groupByMonthAndMap,
    map(metricType === METRIC_TYPES.RATES ? dataRatesMapper : dataCountsMapper),
    (dataset) =>
      sortFilterAndSupplementMostRecentMonths(
        dataset,
        toNumber(metricPeriodMonths),
        "value",
        "0"
      )
  )(countsByMonth);

  const chartDataValues = map("value", dataPoints);
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
      return chartAnnotationForGoal(
        goal,
        "supervisionSuccessSnapshotGoalLine",
        { yAdjust: 10 }
      );
    }
    return null;
  }

  function datasetsWithTrendlineIfApplicable() {
    const datasets = [
      {
        label: toggleLabel(
          { counts: "Successful completions", rates: "Success rate" },
          metricType
        ),
        backgroundColor: CORE_COLORS.indigo,
        borderColor: CORE_COLORS.indigo,
        pointBackgroundColor: CORE_COLORS.indigo,
        pointHoverBackgroundColor: CORE_COLORS.indigo,
        pointHoverBorderColor: CORE_COLORS.indigo,
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
              updateTooltipForMetricType(metricType, tooltipItem, data),
          },
        },
        scales: {
          xAxes: [
            {
              ticks: {
                fontColor: COLORS["grey-600"],
                autoSkip: true,
              },
              scaleLabel: {
                display: true,
                labelString: "Month of scheduled supervision termination",
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
              ticks: toggleYAxisTicksAdditionalOptions(
                METRIC_TYPES.RATES,
                metricType,
                chartMinValue,
                chartMaxValue,
                stepSize,
                { fontColor: COLORS["grey-600"] }
              ),
              scaleLabel: {
                display: true,
                labelString: toggleLabel(
                  { counts: "Successful completions", rates: "% of people" },
                  metricType
                ),
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
      chartTitle: "SUCCESSFUL COMPLETION OF SUPERVISION",
      chartDatasets: chart.props.data.datasets,
      chartLabels: chart.props.data.labels,
      chartBox: document.getElementById(chartId),
      filters: { metricType, metricPeriodMonths, supervisionType, district },
      convertValuesToNumbers: true,
      handleTimeStringLabels: true,
      getTokenSilently,
    });
  }, [
    getTokenSilently,
    metricType,
    metricPeriodMonths,
    supervisionType,
    district,
    chart.props.data.datasets,
    chart.props.data.labels,
  ]);

  useEffect(() => {
    const headerElement = document.getElementById(header);

    if (headerElement && displayGoal) {
      const trendlineValues = chart.props.data.datasets[1].data;
      const trendlineText = trendlineGoalText(trendlineValues, goal);

      const title = `The rate of successful completion of supervision has been <span class='fs-block header-highlight'>trending ${trendlineText}.</span>`;
      headerElement.innerHTML = title;
    } else if (headerElement) {
      headerElement.innerHTML = "";
    }
  }, [chart.props.data.datasets, displayGoal, goal, header]);

  return chart;
};

SupervisionSuccessSnapshot.defaultProps = {
  header: null,
  disableGoal: false,
};

SupervisionSuccessSnapshot.propTypes = {
  supervisionSuccessRates: PropTypes.arrayOf(
    PropTypes.shape({
      district: PropTypes.string,
      projected_month: PropTypes.string,
      projected_year: PropTypes.string,
      revocation_termination: PropTypes.string,
      state_code: PropTypes.string,
      successful_termination: PropTypes.string,
      supervision_type: PropTypes.string,
    })
  ).isRequired,
  metricType: metricTypePropType.isRequired,
  metricPeriodMonths: PropTypes.string.isRequired,
  district: PropTypes.arrayOf(PropTypes.string).isRequired,
  supervisionType: PropTypes.string.isRequired,
  stateCode: PropTypes.string.isRequired,
  header: PropTypes.string,
  disableGoal: PropTypes.bool,
};

export default SupervisionSuccessSnapshot;
