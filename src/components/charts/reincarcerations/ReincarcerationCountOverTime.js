import React, { useState, useEffect } from 'react';

import { Line } from 'react-chartjs-2';
import { configureDownloadButtons } from '../../../assets/scripts/charts/chartJS/downloads';
import { COLORS } from '../../../assets/scripts/constants/colors';
import { monthNamesWithYearsFromNumbers } from '../../../utils/monthConversion';
import { sortAndFilterMostRecentMonths } from '../../../utils/dataOrganizing';
import { getGoalForChart, getMaxForGoalAndData, goalLabelContentString } from '../../../utils/metricGoal';

const ReincarcerationCountOverTime = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);
  const [chartMinValue, setChartMinValue] = useState();
  const [chartMaxValue, setChartMaxValue] = useState();

  const GOAL = getGoalForChart('US_ND', 'reincarceration-counts-by-month-chart');
  const stepSize = 10;

  const processResponse = () => {
    const { reincarcerationCountsByMonth: countsByMonth } = props;

    const dataPoints = [];
    countsByMonth.forEach((data) => {
      const { year, month, returns: count } = data;
      dataPoints.push({ year, month, count });
    });

    const sorted = sortAndFilterMostRecentMonths(dataPoints, 6);
    const chartDataValues = (sorted.map((element) => element.count));
    const max = getMaxForGoalAndData(GOAL.value, chartDataValues, stepSize);

    setChartLabels(monthNamesWithYearsFromNumbers(sorted.map((element) => element.month), false));
    setChartDataPoints(chartDataValues);
    setChartMinValue(0);
    setChartMaxValue(max);
  };

  useEffect(() => {
    processResponse();
  }, [props.reincarcerationCountsByMonth]);

  const chart = (
    <Line
      id="reincarceration-counts-by-month-chart"
      data={{
        labels: chartLabels,
        datasets: [{
          label: 'Reincarceration returns',
          borderColor: COLORS['grey-500'],
          pointBackgroundColor: COLORS['grey-700'],
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
              autoSkip: false,
            },
          }],
          yAxes: [{
            ticks: {
              min: chartMinValue,
              max: chartMaxValue,
              stepSize,
            },
            scaleLabel: {
              display: true,
              labelString: 'Reincarceration count',
            },
          }],
        },
        tooltips: {
          mode: 'x',
        },
        annotation: {
          events: ['click'],
          annotations: [{
            type: 'line',
            mode: 'horizontal',
            value: GOAL.value,

            // optional annotation ID (must be unique)
            id: 'reincarceration-counts-by-month-goal-line',
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
        },
      }}
    />
  );

  const exportedStructureCallback = () => (
    {
      recidivismType: 'reincarceration',
      returnType: 'new_offenses',
      startDate: '2018-11',
      endDate: '2019-04',
      series: [],
    });

  configureDownloadButtons('reincarceration', 'Drivers', chart.props,
    document.getElementById('reincarceration-counts-by-month-chart'), exportedStructureCallback);

  const chartData = chart.props.data.datasets[0].data;
  const mostRecentValue = chartData[chartData.length - 1];

  const header = document.getElementById(props.header);

  if (header && mostRecentValue) {
    const title = `There have been <b style='color:#809AE5'>${mostRecentValue} reincarcerations</b> this month so far.`;
    header.innerHTML = title;
  }

  return (chart);
};

export default ReincarcerationCountOverTime;
