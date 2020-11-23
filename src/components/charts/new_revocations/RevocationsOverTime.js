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

import React from "react";
import PropTypes from "prop-types";
import { Bar, Line } from "react-chartjs-2";

import map from "lodash/fp/map";
import pipe from "lodash/fp/pipe";

import { groupByMonth } from "../common/bars/utils";
import Loading from "../../Loading";
import Error from "../../Error";

import useChartData from "../../../hooks/useChartData";
import { COLORS } from "../../../assets/scripts/constants/colors";
import {
  labelCurrentMonth,
  currentMonthBox,
} from "../../../utils/charts/currentSpan";
import { filterOptimizedDataFormat } from "../../../utils/charts/dataFilters";
import {
  getMonthCountFromMetricPeriodMonthsToggle,
  getTrailingLabelFromMetricPeriodMonthsToggle,
  centerSingleMonthDatasetIfNecessary,
} from "../../../utils/charts/toggles";
import { sortFilterAndSupplementMostRecentMonths } from "../../../utils/transforms/datasets";
import { monthNamesAllWithYearsFromNumbers } from "../../../utils/transforms/months";
import { generateTrendlineDataset } from "../../../utils/charts/trendline";
import { filtersPropTypes } from "../propTypes";
import { translate } from "../../../views/tenants/utils/i18nSettings";
import RevocationsByDimensionComponent from "./RevocationsByDimension/RevocationsByDimensionComponent";

const chartId = "revocationsOverTime";

const RevocationsOverTime = ({
  stateCode,
  dataFilter,
  metricPeriodMonths,
  filterStates,
}) => {
  const { isLoading, isError, apiData, unflattenedValues } = useChartData(
    `${stateCode}/newRevocations`,
    "revocations_matrix_by_month",
    false
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  const chartData = pipe(
    (metricFile) =>
      filterOptimizedDataFormat(
        unflattenedValues,
        apiData,
        metricFile.metadata,
        dataFilter
      ),
    groupByMonth(["total_revocations"]),
    (dataset) =>
      sortFilterAndSupplementMostRecentMonths(
        dataset,
        getMonthCountFromMetricPeriodMonthsToggle(metricPeriodMonths),
        "total_revocations",
        0
      )
  )(apiData);

  const labels = monthNamesAllWithYearsFromNumbers(
    map("month", chartData),
    false
  );
  const dataPoints = map("total_revocations", chartData);

  centerSingleMonthDatasetIfNecessary(dataPoints, labels);

  const chartLabels = labels;
  const chartDataPoints = dataPoints;

  const datasets = [
    {
      label: translate("Revocations"),
      borderColor: COLORS["lantern-light-blue"],
      pointBackgroundColor: COLORS["lantern-light-blue"],
      fill: false,
      lineTension: 0,
      borderWidth: 2,
      data: chartDataPoints,
      backgroundColor: COLORS["lantern-light-blue"],
      hoverBackgroundColor: COLORS["lantern-light-blue"],
      hoverBorderColor: COLORS["lantern-light-blue"],
    },
    generateTrendlineDataset(chartDataPoints, COLORS["blue-standard-light"]),
  ];
  const maxElement = Math.max(...chartDataPoints);
  const maxValue = maxElement <= 3 ? 5 : maxElement;

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          ticks: {
            autoSkip: false,
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: `Number of people ${translate("revoked")}`,
          },
          ticks: {
            min: 0,
            callback(value) {
              if (value % 1 === 0) {
                return value;
              }
              return null;
            },
            suggestedMax: maxValue,
          },
        },
      ],
    },
    tooltips: {
      backgroundColor: COLORS["grey-800-light"],
      mode: "x",
      callbacks: {
        title: (tooltipItem) => labelCurrentMonth(tooltipItem, chartLabels),
      },
    },
    annotation: currentMonthBox(
      "currentMonthBoxRevocationsOverTime",
      chartLabels
    ),
  };

  const countZero = chartDataPoints.filter((item) => item === 0).length;

  const lineChart = (
    <Line
      id={chartId}
      data={{
        labels: chartLabels,
        datasets,
      }}
      options={options}
    />
  );
  const barOptions = options;
  barOptions.scales.xAxes[0].ticks.barThickness = "flex";
  barOptions.scales.xAxes[0].barPercentage = 0.08;

  const barChart = (
    <Bar
      id={chartId}
      width={50}
      data={{
        labels: chartLabels,
        datasets,
      }}
      options={barOptions}
    />
  );

  // If at least a third of all points are 0, show bar chart. Otherwise, show line chart.
  const chart = countZero / metricPeriodMonths >= 0.33 ? barChart : lineChart;

  return (
    <RevocationsByDimensionComponent
      chartTitle={translate("revocationsOverTimeXAxis")}
      timeDescription={getTrailingLabelFromMetricPeriodMonthsToggle(
        metricPeriodMonths
      )}
      labels={chartLabels}
      chartId={chartId}
      datasets={datasets}
      metricTitle={translate("revocationsOverTimeXAxis")}
      filterStates={filterStates}
      chart={chart}
      classModifier={chartId}
      dimension="Month"
    />
  );
};

RevocationsOverTime.propTypes = {
  stateCode: PropTypes.string.isRequired,
  dataFilter: PropTypes.func.isRequired,
  metricPeriodMonths: PropTypes.string.isRequired,
  filterStates: filtersPropTypes.isRequired,
};

export default RevocationsOverTime;
