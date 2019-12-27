// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2019 Recidiviz, Inc.
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

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

import { COLORS } from '../../../assets/scripts/constants/colors';
import { configureDownloadButtons } from '../../../assets/scripts/utils/downloads';
import {
  getGoalForChart, getMaxForGoalAndData, goalLabelContentString,
} from '../../../utils/charts/metricGoal';
import {
  toggleLabel, getMonthCountFromTimeWindowToggle, updateTooltipForMetricType,
  filterDatasetByDistrict,
} from '../../../utils/charts/toggles';
import { sortFilterAndSupplementMostRecentMonths } from '../../../utils/transforms/datasets';
import { toInt } from '../../../utils/transforms/labels';
import { monthNamesWithYearsFromNumbers } from '../../../utils/transforms/months';


const ReincarcerationCountOverTime = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);
  const [chartMinValue, setChartMinValue] = useState();
  const [chartMaxValue, setChartMaxValue] = useState();

  const chartId = 'reincarcerationCountsByMonth';
  const GOAL = getGoalForChart('US_ND', chartId);
  const stepSize = 10;

  const processResponse = () => {
    const { reincarcerationCountsByMonth: countsByMonth } = props;

    const filteredCountsByMonth = filterDatasetByDistrict(
      countsByMonth, props.district,
      ['state_code', 'year', 'month'], ['returns', 'total_admissions'],
    );

    const dataPoints = [];
    if (filteredCountsByMonth) {
      filteredCountsByMonth.forEach((data) => {
        const { year, month } = data;
        const returnCount = toInt(data.returns);
        const admissionCount = toInt(data.total_admissions);

        if (props.metricType === 'counts') {
          const value = returnCount;
          dataPoints.push({ year, month, value });
        } else if (props.metricType === 'rates') {
          let value = 0.00;
          if (admissionCount !== 0) {
            value = (100 * (returnCount / admissionCount)).toFixed(2);
          }
          dataPoints.push({ year, month, value });
        }
      });
    }

    const months = getMonthCountFromTimeWindowToggle(props.timeWindow);
    const sorted = sortFilterAndSupplementMostRecentMonths(dataPoints, months, 'value', 0);
    const chartDataValues = (sorted.map((element) => element.value));
    const max = getMaxForGoalAndData(GOAL.value, chartDataValues, stepSize);

    setChartLabels(monthNamesWithYearsFromNumbers(sorted.map((element) => element.month), false));
    setChartDataPoints(chartDataValues);
    setChartMinValue(0);
    setChartMaxValue(max);
  };

  function goalLineIfApplicable() {
    const { metricType, district } = props;
    if (metricType === 'counts' && district === 'all') {
      return {
        events: ['click'],
        annotations: [{
          type: 'line',
          mode: 'horizontal',
          value: GOAL.value,

          // optional annotation ID (must be unique)
          id: 'reincarcerationCountsByMonthGoalLine',
          scaleID: 'y-axis-0',

          drawTime: 'afterDatasetsDraw',

          borderColor: COLORS['red-standard'],
          borderWidth: 2,
          borderDash: [2, 2],
          borderDashOffset: 5,
          label: {
            enabled: true,
            content: goalLabelContentString(GOAL),
            position: 'right',

            // Background color of label, default below
            backgroundColor: 'rgba(0,0,0,0)',

            fontFamily: 'sans-serif',
            fontSize: 12,
            fontStyle: 'bold',
            fontColor: COLORS['red-standard'],

            // Adjustment along x-axis (left-right) of label relative to above
            // number (can be negative). For horizontal lines positioned left
            // or right, negative values move the label toward the edge, and
            // positive values toward the center.
            xAdjust: 0,

            // Adjustment along y-axis (top-bottom) of label relative to above
            // number (can be negative). For vertical lines positioned top or
            // bottom, negative values move the label toward the edge, and
            // positive values toward the center.
            yAdjust: -10,
          },

          onClick(e) { return e; },
        }],
      };
    }

    return null;
  }

  useEffect(() => {
    processResponse();
  }, [
    props.reincarcerationCountsByMonth,
    props.metricType,
    props.timeWindow,
    props.district,
  ]);

  const chart = (
    <Line
      id={chartId}
      data={{
        labels: chartLabels,
        datasets: [{
          label: toggleLabel(
            {
              counts: 'Reincarceration count',
              rates: 'Percent of admissions that are reincarcerations',
            },
            props.metricType,
          ),
          backgroundColor: COLORS['grey-500'],
          borderColor: COLORS['grey-500'],
          pointBackgroundColor: COLORS['grey-500'],
          pointHoverBackgroundColor: COLORS['grey-500'],
          pointHoverBorderColor: COLORS['grey-500'],
          fill: false,
          borderWidth: 2,
          data: chartDataPoints,
        }],
      }}
      options={{
        legend: {
          display: false,
          position: 'bottom',
          labels: {
            usePointStyle: true,
            boxWidth: 20,
          },
        },
        scales: {
          xAxes: [{
            ticks: {
              autoSkip: true,
            },
          }],
          yAxes: [{
            ticks: {
              // min: chartMinValue,
              // max: chartMaxValue,
              // stepSize,
            },
            scaleLabel: {
              display: true,
              labelString: toggleLabel(
                {
                  counts: 'Reincarceration count',
                  rates: 'Percent of admissions',
                },
                props.metricType,
              ),
            },
          }],
        },
        tooltips: {
          backgroundColor: COLORS['grey-800-light'],
          mode: 'x',
          callbacks: {
            label: (tooltipItem, data) => updateTooltipForMetricType(props.metricType, tooltipItem, data),
          },
        },
        annotation: goalLineIfApplicable(),
      }}
    />
  );

  const exportedStructureCallback = () => (
    {
      metric: 'Reincarceration counts by month',
      series: [],
    });

  configureDownloadButtons(chartId, 'REINCARCERATIONS BY MONTH',
    chart.props.data.datasets, chart.props.data.labels,
    document.getElementById(chartId),
    exportedStructureCallback);

  const chartData = chart.props.data.datasets[0].data;
  const mostRecentValue = chartData[chartData.length - 1];

  const header = document.getElementById(props.header);

  if (header && (mostRecentValue !== null)) {
    const title = `There have been <b style='color:#809AE5'>${mostRecentValue} reincarcerations</b> to a DOCR facility this month so far.`;
    header.innerHTML = title;
  }

  return (chart);
};

export default ReincarcerationCountOverTime;
