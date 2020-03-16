import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

import { COLORS } from '../../../assets/scripts/constants/colors';
import {
  toggleLabel, getMonthCountFromMetricPeriodMonthsToggle, updateTooltipForMetricType,
  toggleYAxisTicksStackedRateBasicCount,
} from '../../../utils/charts/toggles';
import { sortFilterAndSupplementMostRecentMonths } from '../../../utils/transforms/datasets';
import { monthNamesWithYearsFromNumbers } from '../../../utils/transforms/months';

export const getChartDefinition = ({
    chartId,
    countsByMonth,
    metricType,
    numMonths,
    filters,
    bars,
    yAxisLabel,
    barColorPalette
}) => {
  // TODO(233): Try to streamline this function more.
  let filteredCountsByMonth = countsByMonth.filter(entry => {
    for (const key in filters) {
      if (String(entry[key]).toUpperCase() !== String(filters[key].toUpperCase())) return false;
    }

    return true;
  });

  const dataPoints = [];
  if (filteredCountsByMonth) {
    filteredCountsByMonth.forEach((data) => {
      const { year, month } = data;

      const monthCounts = bars
          .map(bar => bar.key)
          .reduce((monthCounts, key) => Object.assign(monthCounts, {[key]: Number(data[key])}), {});

      const totalCount = Object.values(monthCounts).reduce((total, val) => total + Number(val), 0);

      if (metricType === 'counts') {
        dataPoints.push({ year, month, monthDict: monthCounts });
      } else if (metricType === 'rates') {
        const monthRates = {};
        Object.keys(monthCounts).forEach((key) => {
          const count = monthCounts[key];
          monthRates[key] = Number((100 * (count / totalCount)).toFixed(2));
        });

        dataPoints.push({ year, month, monthDict: monthRates });
      }
    });
  }

  const emptyMonthDict =
      bars.map(bar => bar.key).reduce((monthCounts, key) => Object.assign(monthCounts, {[key]: 0}), {});

  const months = getMonthCountFromMetricPeriodMonthsToggle(numMonths);
  const sorted = sortFilterAndSupplementMostRecentMonths(dataPoints, months, 'monthDict', emptyMonthDict);
  const monthsLabels = [];

  const dataArrays = bars
      .map(bar => bar.key)
      .reduce((monthCounts, key) => Object.assign(monthCounts, {[key]: []}), {});

  for (let i = 0; i < months; i += 1) {
    monthsLabels.push(sorted[i].month);
    const data = sorted[i].monthDict;
    Object.keys(data).forEach((dataType) => {
      dataArrays[dataType].push(data[dataType]);
    });
  }

  const chartLabels = monthNamesWithYearsFromNumbers(monthsLabels, false);

  const datasets = bars.map((bar, i) => ({
    label: bar.label,
    backgroundColor: barColorPalette[i],
    hoverBackgroundColor: barColorPalette[i],
    hoverBorderColor: barColorPalette[i],
    data: dataArrays[bar.key],
  }));

  return {
    id: chartId,
    data: {
      labels: chartLabels,
      datasets,
    },
    options: {
      responsive: true,
      legend: {
        position: 'bottom',
        boxWidth: 10,
      },
      tooltips: {
        backgroundColor: COLORS['grey-800-light'],
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (tooltipItem, data) => updateTooltipForMetricType(
              metricType, tooltipItem, data,
          ),
        },
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Month',
          },
          stacked: true,
        }],
        yAxes: [{
          ticks: toggleYAxisTicksStackedRateBasicCount(metricType, undefined),
          scaleLabel: {
            display: true,
            labelString: toggleLabel(
                {[metricType]: yAxisLabel},
                metricType,
            ),
          },
          stacked: true,
        }],
      }
    }
  }
};
