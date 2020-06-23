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
import { Bar } from "react-chartjs-2";

import { COLORS } from "../../../../assets/scripts/constants/colors";
import {
  getMonthCountFromMetricPeriodMonthsToggle,
  updateTooltipForMetricType,
  toggleYAxisTicksStackedRateBasicCount,
  toggleLabel,
} from "../../../../utils/charts/toggles";
import { sortFilterAndSupplementMostRecentMonths } from "../../../../utils/transforms/datasets";
import { monthNamesWithYearsFromNumbers } from "../../../../utils/transforms/months";

const PerMonthBarChart = ({
  chartId,
  countsByMonth,
  metricType,
  numMonths,
  filters,
  bars,
  yAxisLabel,
  barColorPalette,
}) => {
  // TODO(233): Try to streamline this function more.
  const filteredCountsByMonth = countsByMonth.filter((entry) =>
    Object.keys(filters).some((key) => {
      const field = entry[key];
      const filter = filters[key];

      if (Array.isArray(filter)) {
        if (filter.includes(field)) return true;
      } else if (String(entry).toUpperCase() === String(filter).toUpperCase()) {
        return true;
      }

      return false;
    })
  );

  const dataPoints = [];
  if (filteredCountsByMonth) {
    filteredCountsByMonth.forEach((data) => {
      const { year, month } = data;

      const monthCounts = bars
        .map((bar) => bar.key)
        .reduce(
          (monthCountsAcc, key) =>
            Object.assign(monthCountsAcc, { [key]: Number(data[key]) }),
          {}
        );

      const totalCount = Object.values(monthCounts).reduce(
        (total, val) => total + Number(val),
        0
      );

      if (metricType === "counts") {
        dataPoints.push({ year, month, monthDict: monthCounts });
      } else if (metricType === "rates") {
        const monthRates = {};
        Object.keys(monthCounts).forEach((key) => {
          const count = monthCounts[key];
          monthRates[key] = Number((100 * (count / totalCount)).toFixed(2));
        });

        dataPoints.push({ year, month, monthDict: monthRates });
      }
    });
  }

  const emptyMonthDict = bars
    .map((bar) => bar.key)
    .reduce((monthCounts, key) => Object.assign(monthCounts, { [key]: 0 }), {});

  const months = getMonthCountFromMetricPeriodMonthsToggle(numMonths);
  const sorted = sortFilterAndSupplementMostRecentMonths(
    dataPoints,
    months,
    "monthDict",
    emptyMonthDict
  );
  const monthsLabels = [];

  const dataArrays = bars
    .map((bar) => bar.key)
    .reduce(
      (monthCounts, key) => Object.assign(monthCounts, { [key]: [] }),
      {}
    );

  for (let i = 0; i < months; i += 1) {
    monthsLabels.push(sorted[i].month);
    const data = sorted[i].monthDict;
    Object.keys(data).forEach((dataType) => {
      dataArrays[dataType].push(data[dataType]);
    });
  }

  const chartLabels = monthNamesWithYearsFromNumbers(monthsLabels, true);

  const datasets = bars.map((bar, i) => ({
    label: bar.label,
    backgroundColor: barColorPalette[i],
    hoverBackgroundColor: barColorPalette[i],
    hoverBorderColor: barColorPalette[i],
    data: dataArrays[bar.key],
  }));

  return (
    <Bar
      id={chartId}
      data={{
        labels: chartLabels,
        datasets,
      }}
      options={{
        responsive: true,
        legend: {
          position: "bottom",
          boxWidth: 10,
        },
        tooltips: {
          backgroundColor: COLORS["grey-800-light"],
          mode: "index",
          intersect: false,
          callbacks: {
            label: (tooltipItem, data) =>
              updateTooltipForMetricType(metricType, tooltipItem, data),
          },
        },
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Month",
              },
              stacked: true,
            },
          ],
          yAxes: [
            {
              ticks: toggleYAxisTicksStackedRateBasicCount(
                metricType,
                undefined
              ),
              scaleLabel: {
                display: true,
                labelString: toggleLabel(
                  { [metricType]: yAxisLabel },
                  metricType
                ),
              },
              stacked: true,
            },
          ],
        },
      }}
    />
  );
};

PerMonthBarChart.defaultProps = {
  countsByMonth: [],
  filters: {},
};

PerMonthBarChart.propTypes = {
  chartId: PropTypes.string.isRequired,
  countsByMonth: PropTypes.arrayOf(PropTypes.shape({})),
  metricType: PropTypes.string.isRequired,
  numMonths: PropTypes.arrayOf(PropTypes.string).isRequired,
  filters: PropTypes.shape({}),
  bars: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string,
    })
  ).isRequired,
  yAxisLabel: PropTypes.string.isRequired,
  barColorPalette: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PerMonthBarChart;
