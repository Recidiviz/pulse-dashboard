import React, { useState, useEffect } from 'react';

import { Line } from 'react-chartjs-2';
import { trendlineLinear } from 'chartjs-plugin-trendline';
import { configureDownloadButtons } from '../../../assets/scripts/charts/chartJS/downloads';
import { COLORS } from '../../../assets/scripts/constants/colors';

const DaysAtLibertySnapshot = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  // TODO: Update this to process LSIR data
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

  const chart = (
    <Line
      id="days-at-liberty-snapshot-chart"
      data={{
        labels: ["Mar '18", 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', "Jan '19", 'Feb', 'Mar'],
        datasets: [{
          backgroundColor: COLORS['blue-standard'],
          borderColor: COLORS['blue-standard'],
          pointBackgroundColor: COLORS['blue-standard'],
          pointRadius: 4,
          hitRadius: 5,
          fill: false,
          borderWidth: 1,
          lineTension: 0,
          data: [897.91, 924.41, 818.27, 826.52, 728.31, 656.56, 650.30, 605.83,
            849.50, 562.70, 629.14, 1030.38, 813.00],
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
              labelString: 'Month of readmission',
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
              min: 500,
              max: 1200,
            },
            scaleLabel: {
              display: true,
              labelString: '# of days',
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
            value: 1095,

            // optional annotation ID (must be unique)
            id: 'days-at-liberty-snapshot-goal-line',
            scaleID: 'y-axis-0',

            drawTime: 'afterDatasetsDraw',

            borderColor: COLORS['red-400'],
            borderWidth: 2,
            borderDash: [2, 2],
            borderDashOffset: 5,
            label: {
              enabled: true,
              content: 'goal: 1095 days (3 years)',
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
  configureDownloadButtons('days-at-liberty', 'Snapshot', chart.props,
    document.getElementById('days-at-liberty-snapshot-chart'), exportedStructureCallback);

  return (chart);
};

export default DaysAtLibertySnapshot;
