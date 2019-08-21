import React, { useState, useEffect } from 'react';

import { Line } from 'react-chartjs-2';
import { configureDownloadButtons } from '../../../assets/scripts/charts/chartJS/downloads';
import { COLORS } from '../../../assets/scripts/constants/colors';
import { monthNamesShortWithYearsFromNumberList, monthNamesFromShortName } from '../../../utils/monthConversion';

const SupervisionSuccessSnapshot = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  const processResponse = () => {
    const { supervisionSuccessRates: countsByMonth } = props;

    if (countsByMonth) {
      const today = new Date();
      const yearNow = today.getFullYear();
      const monthNow = today.getMonth() + 1;

      let sorted = [];
      countsByMonth.forEach((data) => {
        const { projected_year: year } = data;
        const { projected_month: month } = data;
        const successful = parseInt(data.successful_termination, 10);
        const revocation = parseInt(data.revocation_termination, 10);
        const successRate = (100 * (successful / (successful + revocation))).toFixed(2);

        // Don't add completion rates for months in the future
        if (year < yearNow || month <= monthNow) {
          sorted.push([year, month, successRate]);
        }
      });

      // Sort by month and year
      sorted.sort((a, b) => ((a[0] === b[0]) ? (a[1] - b[1]) : (a[0] - b[0])));

      // Just display the most recent 13 months
      sorted = sorted.slice(sorted.length - 13, sorted.length);

      setChartLabels(monthNamesShortWithYearsFromNumberList(sorted.map((element) => element[1])));
      setChartDataPoints(sorted.map((element) => element[2]));
    }
  };

  useEffect(() => {
    processResponse();
  }, [props.supervisionSuccessRates]);

  const chart = (
    <Line
      id="supervision-success-snapshot-chart"
      data={{
        labels: chartLabels,
        datasets: [{
          // TODO(51): Add custom trendline plugin
          backgroundColor: COLORS['blue-standard'],
          borderColor: COLORS['blue-standard'],
          pointBackgroundColor: COLORS['blue-standard'],
          pointRadius: 4,
          hitRadius: 5,
          fill: false,
          borderWidth: 1,
          lineTension: 0,
          data: chartDataPoints,
        },
        ],
      }}
      options={{
        legend: {
          display: false,
          position: 'right',
          labels: {
            usePointStyle: true,
            boxWidth: 5,
          },
        },
        tooltips: {
          enabled: true,
          mode: 'x',
        },
        scales: {
          xAxes: [{
            ticks: {
              fontColor: COLORS['grey-600'],
              autoSkip: false,
            },
            scaleLabel: {
              display: true,
              labelString: 'Final scheduled month of supervision',
              fontColor: COLORS['grey-500'],
              fontStyle: 'bold',
            },
            gridLines: {
              color: '#FFF',
            },
          }],
          yAxes: [{
            ticks: {
              fontColor: COLORS['grey-600'],
              max: 100,
            },
            scaleLabel: {
              display: true,
              labelString: '% of people',
              fontColor: COLORS['grey-500'],
              fontStyle: 'bold',
            },
            gridLines: {
              color: COLORS['grey-300'],
            },
          }],
        },
        annotation: {
          drawTime: 'afterDatasetsDraw',
          events: ['click'],

          // Array of annotation configuration objects
          // See below for detailed descriptions of the annotation options
          annotations: [{
            type: 'line',
            mode: 'horizontal',
            value: 70,

            // optional annotation ID (must be unique)
            id: 'supervision-success-snapshot-goal-line',
            scaleID: 'y-axis-0',

            drawTime: 'afterDatasetsDraw',

            borderColor: COLORS['red-400'],
            borderWidth: 2,
            borderDash: [2, 2],
            borderDashOffset: 5,
            label: {
              enabled: true,
              content: 'goal: 70%',
              position: 'right',

              // Background color of label, default below
              backgroundColor: 'rgba(0, 0, 0, 0)',

              fontFamily: 'sans-serif',
              fontSize: 12,
              fontStyle: 'bold',
              fontColor: COLORS['red-400'],

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

  const exportedStructureCallback = function exportedStructureCallback() {
    return {
      metric: 'percentage-successful-supervision-termination',
      series: [],
    };
  };

  configureDownloadButtons('supervisionSuccess', 'Snapshot', chart.props,
    document.getElementById('supervision-success-snapshot-chart'), exportedStructureCallback);

  const chartData = chart.props.data.datasets[0].data;
  const mostRecentValue = chartData[chartData.length - 1];

  const chartDataLabels = chart.props.data.labels;
  const mostRecentMonth = monthNamesFromShortName(chartDataLabels[chartDataLabels.length - 1]);

  const header = document.getElementById(props.header);

  if (header && mostRecentValue && mostRecentMonth) {
    const title = `<b style='color:#809AE5'>${mostRecentValue}% of people</b> whose supervision was scheduled to end in ${mostRecentMonth} <b style='color:#809AE5'>successfully completed their supervision </b> by that time.`;
    header.innerHTML = title;
  }

  return (chart);
};

export default SupervisionSuccessSnapshot;
