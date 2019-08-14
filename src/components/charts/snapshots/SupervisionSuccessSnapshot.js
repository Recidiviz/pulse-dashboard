import React, { useState, useEffect } from 'react';

import { Line } from 'react-chartjs-2';
import { trendlineLinear } from 'chartjs-plugin-trendline';
import { configureDownloadButtons } from '../../../assets/scripts/charts/chartJS/downloads';
import { COLORS } from '../../../assets/scripts/constants/colors';
import { monthNamesShortFromNumberList, monthNamesFromShortName } from '../../../utils/monthConversion';

const SupervisionSuccessSnapshot = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  // TODO: Update this to process supervision success data
  const processResponse = () => {
    const countsByMonth = props.revocationCountsByMonth;

    var sorted = [];
    for (var month in countsByMonth) {
      sorted.push([month, countsByMonth[month]]);
    }

    setChartLabels(sorted.map((element) => element[0]));
    setChartDataPoints(sorted.map((element) => element[1]));
  };

  useEffect(() => {
    processResponse();
  }, [props.revocationCountsByMonth]);

  const months = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3];
  const monthNamesShort = monthNamesShortFromNumberList(months);

  const chart = (
    <Line
      id="supervision-success-snapshot-chart"
      data={{
        labels: monthNamesShort,
        datasets: [{
          backgroundColor: COLORS['blue-standard'],
          borderColor: COLORS['blue-standard'],
          pointBackgroundColor: COLORS['blue-standard'],
          pointRadius: 4,
          hitRadius: 5,
          fill: false,
          borderWidth: 1,
          lineTension: 0,
          data: [69.32, 68.64, 66.48, 66.73, 69.24,
            69.21, 66.99, 67.18, 65.72, 68.26,
            69.61, 65.06, 47.53],
          trendlineLinear: {
            style: COLORS['yellow-standard'],
            lineStyle: 'solid',
            width: 1,
          },
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
            value: 75,

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
              content: 'goal: 75%',
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

  // TODO: Change this to have export for supervision success data
  const exportedStructureCallback = function exportedStructureCallback() {
    return {
      recidivismType: 'reincarceration',
      returnType: 'revocations',
      startDate: '2018-11',
      endDate: '2019-04',
      series: [],
    };
  };
  configureDownloadButtons('supervision-success', 'Snapshot', chart.props,
    document.getElementById('supervision-success-snapshot-chart'), exportedStructureCallback);

  const chartData = chart.props.data.datasets[0].data;
  const mostRecentValue = chartData[chartData.length - 1];

  const chartDataLabels = chart.props.data.labels;
  const mostRecentMonth = monthNamesFromShortName(chartDataLabels[chartDataLabels.length - 1]);

  const header = document.getElementById('supervisionSuccessSnapshot-header');

  if (header) {
    const str1 = "<b style='color:#809AE5'>";
    const str2 = `${mostRecentValue}`;
    const str3 = '% of people </b> whose supervision was scheduled to end in ';
    const str4 = `${mostRecentMonth}`;
    const str5 = " <b style='color:#809AE5'>successfully completed their supervision </b> by that time.";
    header.innerHTML = str1.concat(str2, str3, str4, str5);
  }

  return (chart);
};

export default SupervisionSuccessSnapshot;
