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
import { Line } from "react-chartjs-2";
import pipe from "lodash/fp/pipe";

import { COLORS } from "../../../assets/scripts/constants/colors";
import { configureDownloadButtons } from "../../../assets/scripts/utils/downloads";
import {
  getGoalForChart,
  getMaxForGoalAndDataIfGoalDisplayable,
  chartAnnotationForGoal,
} from "../../../utils/charts/metricGoal";
import {
  toggleLabel,
  getMonthCountFromMetricPeriodMonthsToggle,
  updateTooltipForMetricType,
  filterDatasetBySupervisionType,
  filterDatasetByDistrict,
  canDisplayGoal,
  toggleYAxisTicksFor,
  centerSingleMonthDatasetIfNecessary,
} from "../../../utils/charts/toggles";
import { sortFilterAndSupplementMostRecentMonths } from "../../../utils/transforms/datasets";
import { monthNamesWithYearsFromNumbers } from "../../../utils/transforms/months";

const sumReducer = (
  acc,
  {
    year,
    month,
    revocation_count: revocationCount,
    total_supervision_count: supervisionCount,
  }
) => {
  const item = acc.find((s) => s.year === year && s.month === month);
  const count = parseInt(revocationCount, 10);
  const totalCount = parseInt(supervisionCount, 10);

  if (item) {
    item.count += count;
    item.totalCount += totalCount;
  } else {
    acc.push({ year, month, count, totalCount });
  }

  return acc;
};

const calculateMapper = (metricType) => (item) => {
  switch (metricType) {
    case "rates":
      return {
        ...item,
        value: (
          100 *
          (parseInt(item.count, 10) / parseInt(item.totalCount, 10))
        ).toFixed(2),
      };
    case "counts":
    default:
      return { ...item, value: item.count };
  }
};

const RevocationCountOverTime = ({
  revocationCountsByMonth: countsByMonth,
  supervisionType,
  district,
  metricType,
  metricPeriodMonths,
  disableGoal,
  geoView,
  header,
}) => {
  const chartId = "revocationCountsByMonth";
  const GOAL = getGoalForChart("US_ND", chartId);
  const stepSize = 10;

  const chartDataPoints = pipe(
    (dataset) => filterDatasetBySupervisionType(dataset, supervisionType),
    (dataset) => filterDatasetByDistrict(dataset, district),
    (dataset) => dataset.reduce(sumReducer, []),
    (dataset) => dataset.map(calculateMapper(metricType)),
    (dataset) =>
      sortFilterAndSupplementMostRecentMonths(
        dataset,
        getMonthCountFromMetricPeriodMonthsToggle(metricPeriodMonths),
        "value",
        0
      )
  )(countsByMonth);

  const chartDataValues = chartDataPoints.map((element) => element.value);
  const chartLabels = monthNamesWithYearsFromNumbers(
    chartDataPoints.map((element) => element.month),
    true
  );

  const chartMinValue = 0;
  const chartMaxValue = getMaxForGoalAndDataIfGoalDisplayable(
    GOAL,
    chartDataValues,
    stepSize,
    { disableGoal, geoView, metricType, supervisionType, district }
  );

  centerSingleMonthDatasetIfNecessary(chartDataValues, chartLabels);

  const displayGoal = canDisplayGoal(GOAL, {
    disableGoal,
    geoView,
    metricType,
    supervisionType,
    district,
  });

  function goalLineIfApplicable() {
    if (displayGoal) {
      return chartAnnotationForGoal(
        GOAL,
        "revocationCountsByMonthGoalLine",
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
              { counts: "Revocation count", rates: "Revocation rate" },
              metricType
            ),
            backgroundColor: COLORS["grey-500"],
            borderColor: COLORS["grey-500"],
            pointBackgroundColor: COLORS["grey-500"],
            pointHoverBackgroundColor: COLORS["grey-500"],
            pointHoverBorderColor: COLORS["grey-500"],
            fill: false,
            borderWidth: 2,
            data: chartDataValues,
          },
        ],
      }}
      options={{
        legend: {
          display: false,
          position: "bottom",
          labels: {
            usePointStyle: true,
            boxWidth: 10,
          },
        },
        scales: {
          yAxes: [
            {
              ticks: toggleYAxisTicksFor(
                "counts",
                metricType,
                chartMinValue,
                chartMaxValue,
                stepSize
              ),
              scaleLabel: {
                display: true,
                labelString: toggleLabel(
                  { counts: "Revocation count", rates: "Percentage" },
                  metricType
                ),
              },
              stacked: true,
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

  const exportedStructureCallback = () => ({
    metric: "Revocation counts by month",
    series: [],
  });

  configureDownloadButtons(
    chartId,
    "REVOCATION ADMISSIONS BY MONTH",
    chart.props.data.datasets,
    chart.props.data.labels,
    document.getElementById(chartId),
    exportedStructureCallback,
    { metricType, supervisionType, district },
    true,
    true
  );

  const chartData = chart.props.data.datasets[0].data;
  const mostRecentValue = chartData[chartData.length - 1];

  const headerElement = document.getElementById(header);

  if (header && mostRecentValue !== null && displayGoal) {
    const title = `There have been <span class='fs-block header-highlight'>${mostRecentValue} revocations</span> that led to incarceration in a DOCR facility this month so far.`;
    headerElement.innerHTML = title;
  } else if (header) {
    headerElement.innerHTML = "";
  }

  return chart;
};

export default RevocationCountOverTime;
