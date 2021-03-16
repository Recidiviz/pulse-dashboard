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
import map from "lodash/fp/map";
import pipe from "lodash/fp/pipe";
import sumBy from "lodash/fp/sumBy";
import toInteger from "lodash/fp/toInteger";
import values from "lodash/fp/values";

import { COLORS, CORE_COLORS } from "../../assets/scripts/constants/colors";
import { configureDownloadButtons } from "../utils/configureDownloadButtons";
import { filterDatasetByDistrict } from "../utils/dataFilters";
import {
  getGoalForChart,
  getMaxForGoalAndDataIfGoalDisplayable,
  chartAnnotationForGoal,
} from "../utils/metricGoal";
import {
  toggleLabel,
  updateTooltipForMetricType,
  canDisplayGoal,
  toggleYAxisTicksFor,
} from "../utils/tooltips";
import { toNumber } from "../../utils";
import {
  sortFilterAndSupplementMostRecentMonths,
  centerSingleMonthDatasetIfNecessary,
} from "../../utils/datasets";
import { monthNamesWithYearsFromNumbers } from "../utils/timePeriod";
import { METRIC_TYPES } from "../utils/constants";
import { metricTypePropType } from "../utils/propTypes";

const chartId = "reincarcerationCountsByMonth";
const stepSize = 5;

const dataCountsMapper = (dataset) => ({
  year: dataset[0].year,
  month: dataset[0].month,
  value: sumBy((data) => toInteger(data.returns), dataset),
});

const dataRatesMapper = (dataset) => {
  const returnCount = sumBy((data) => toInteger(data.returns), dataset);
  const admissionCount = sumBy(
    (data) => toInteger(data.total_admissions),
    dataset
  );
  const value =
    admissionCount !== 0
      ? (100 * (returnCount / admissionCount)).toFixed(2)
      : 0.0;

  return {
    year: dataset[0].year,
    month: dataset[0].month,
    value,
  };
};

const sortAndSupplementMostRecentMonths = (metricPeriodMonths) => (dataset) =>
  sortFilterAndSupplementMostRecentMonths(
    dataset,
    toNumber(metricPeriodMonths),
    "value",
    0
  );

const ReincarcerationCountOverTime = ({
  reincarcerationCountsByMonth: countsByMonth,
  district,
  metricType,
  metricPeriodMonths,
  disableGoal,
  header = null,
  stateCode,
  getTokenSilently,
}) => {
  const goal = getGoalForChart(stateCode, chartId);
  const goalProps = {
    disableGoal,
    district,
    metricType,
    metricPeriodMonths,
  };
  const displayGoal = canDisplayGoal(goal, goalProps);

  const dataPoints = pipe(
    (dataset) => filterDatasetByDistrict(dataset, district),
    groupBy(({ year, month }) => `${year}-${month}`),
    values,
    map(metricType === METRIC_TYPES.RATES ? dataRatesMapper : dataCountsMapper),
    sortAndSupplementMostRecentMonths(metricPeriodMonths)
  )(countsByMonth);

  const chartDataValues = map("value", dataPoints);
  const max = getMaxForGoalAndDataIfGoalDisplayable(
    goal,
    chartDataValues,
    stepSize,
    goalProps
  );
  const monthNames = monthNamesWithYearsFromNumbers(
    map("month", dataPoints),
    true
  );

  centerSingleMonthDatasetIfNecessary(chartDataValues, monthNames);

  const chartLabels = monthNames;
  const chartDataPoints = chartDataValues;
  const chartMinValue = 0;
  const chartMaxValue = max;

  function goalLineIfApplicable() {
    if (displayGoal) {
      return chartAnnotationForGoal(
        goal,
        "reincarcerationCountsByMonthGoalLine",
        {}
      );
    }
    return null;
  }

  const chart = (
    <Line
      id={chartId}
      data={{
        labels: chartLabels,
        datasets: [
          {
            label: toggleLabel(
              {
                counts: "Reincarceration admissions",
                rates: "Percentage from reincarcerations",
              },
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
        ],
      }}
      options={{
        plugins: {
          datalabels: {
            display: false,
          },
        },
        legend: {
          display: false,
          position: "bottom",
          labels: {
            usePointStyle: true,
            boxWidth: 20,
          },
        },
        scales: {
          xAxes: [
            {
              ticks: {
                autoSkip: true,
              },
              gridLines: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              ticks: toggleYAxisTicksFor(
                METRIC_TYPES.COUNTS,
                metricType,
                chartMinValue,
                chartMaxValue,
                stepSize
              ),
              scaleLabel: {
                display: true,
                labelString: toggleLabel(
                  {
                    counts: "Reincarceration count",
                    rates: "Percent of admissions",
                  },
                  metricType
                ),
              },
            },
          ],
        },
        tooltips: {
          backgroundColor: COLORS["grey-800-light"],
          mode: "x",
          callbacks: {
            label: (tooltipItem, data) =>
              updateTooltipForMetricType(metricType, tooltipItem, data),
          },
        },
        annotation: goalLineIfApplicable(),
      }}
    />
  );

  useEffect(() => {
    configureDownloadButtons({
      chartId,
      chartTitle: "REINCARCERATIONS BY MONTH",
      chartDatasets: chart.props.data.datasets,
      chartLabels: chart.props.data.labels,
      chartBox: document.getElementById(chartId),
      filters: { district, metricType, metricPeriodMonths },
      convertValuesToNumbers: true,
      handleTimeStringLabels: true,
      getTokenSilently,
    });
  }, [
    getTokenSilently,
    chart.props.data.datasets,
    chart.props.data.labels,
    district,
    metricPeriodMonths,
    metricType,
  ]);

  useEffect(() => {
    const chartData = chart.props.data.datasets[0].data;
    const mostRecentValue = chartData[chartData.length - 1];

    const headerElement = header && document.getElementById(header);

    if (headerElement && mostRecentValue !== null && displayGoal) {
      const title = `There have been <span class='fs-block header-highlight'>${mostRecentValue} reincarcerations</span> to a DOCR facility this month so far.`;
      headerElement.innerHTML = title;
    } else if (headerElement) {
      headerElement.innerHTML = "";
    }
  }, [chart.props.data.datasets, displayGoal, header]);

  return chart;
};

ReincarcerationCountOverTime.defaultProps = {
  disableGoal: false,
  header: null,
};

ReincarcerationCountOverTime.propTypes = {
  reincarcerationCountsByMonth: PropTypes.arrayOf(
    PropTypes.shape({
      district: PropTypes.string,
      month: PropTypes.string,
      returns: PropTypes.string,
      state_code: PropTypes.string,
      total_admissions: PropTypes.string,
      year: PropTypes.string,
    })
  ).isRequired,
  metricType: metricTypePropType.isRequired,
  metricPeriodMonths: PropTypes.string.isRequired,
  district: PropTypes.arrayOf(PropTypes.string).isRequired,
  disableGoal: PropTypes.bool,
  header: PropTypes.string,
  stateCode: PropTypes.string.isRequired,
};

export default ReincarcerationCountOverTime;
