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
import { Bar, Line } from "react-chartjs-2";
import { observer } from "mobx-react-lite";
import { get } from "mobx";

import map from "lodash/fp/map";
import pipe from "lodash/fp/pipe";

import { groupByMonth } from "../common/bars/utils";
import LoadingChart from "./LoadingChart";
import Error from "../../Error";

import { useContainerHeight } from "../../../hooks/useContainerHeight";
import { COLORS } from "../../../assets/scripts/constants/colors";
import { currentMonthBox } from "../../../utils/charts/currentSpan";
import {
  getMonthCountFromMetricPeriodMonthsToggle,
  getTrailingLabelFromMetricPeriodMonthsToggle,
  centerSingleMonthDatasetIfNecessary,
} from "../../../utils/charts/toggles";
import { sortFilterAndSupplementMostRecentMonths } from "../../../utils/transforms/datasets";
import { monthNamesAllWithYearsFromNumbers } from "../../../utils/transforms/months";
import { generateTrendlineDataset } from "../../../utils/charts/trendline";
import { translate } from "../../../views/tenants/utils/i18nSettings";
import { useRootStore } from "../../../StoreProvider";
import { METRIC_PERIOD_MONTHS } from "../../../constants/filterTypes";

import RevocationsByDimensionComponent from "./RevocationsByDimension/RevocationsByDimensionComponent";

const RevocationsOverTime = () => {
  const { filters, dataStore } = useRootStore();
  const store = dataStore.revocationsOverTimeStore;
  const chartId = `${translate("revocations")}OverTime`;
  const { containerHeight, containerRef } = useContainerHeight();

  if (store.isLoading) {
    return <LoadingChart containerHeight={containerHeight} />;
  }

  if (store.isError) {
    return <Error />;
  }

  const chartData = pipe(groupByMonth(["total_revocations"]), (dataset) =>
    sortFilterAndSupplementMostRecentMonths(
      dataset,
      getMonthCountFromMetricPeriodMonthsToggle(
        get(filters, METRIC_PERIOD_MONTHS)
      ),
      "total_revocations",
      0
    )
  )(store.filteredData);

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
    generateTrendlineDataset(chartDataPoints, COLORS["lantern-soft-blue"]),
  ];
  const maxElement = Math.max(...chartDataPoints);
  const maxValue = maxElement <= 7 ? 7 : maxElement;

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
            suggestedMax: maxValue,
          },
        },
      ],
    },
    tooltips: {
      backgroundColor: COLORS["grey-800-light"],
      mode: "x",
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
  const chart =
    countZero / get(filters, METRIC_PERIOD_MONTHS) >= 0.33
      ? barChart
      : lineChart;

  return (
    <div ref={containerRef}>
      <RevocationsByDimensionComponent
        chartTitle={translate("revocationsOverTimeXAxis")}
        timeDescription={getTrailingLabelFromMetricPeriodMonthsToggle(
          get(filters, METRIC_PERIOD_MONTHS)
        )}
        labels={chartLabels}
        chartId={`${translate("revocations")}OverTime`}
        datasets={datasets}
        metricTitle={translate("revocationsOverTimeXAxis")}
        chart={chart}
        classModifier={chartId}
        dataExportLabel="Month"
      />
    </div>
  );
};

export default observer(RevocationsOverTime);
