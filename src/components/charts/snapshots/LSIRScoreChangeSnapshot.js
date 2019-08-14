import React, { useState, useEffect } from 'react';

import { Line } from 'react-chartjs-2';
import { trendlineLinear } from 'chartjs-plugin-trendline';
import { configureDownloadButtons } from '../../../assets/scripts/charts/chartJS/downloads';
import { COLORS } from '../../../assets/scripts/constants/colors';
import { monthNamesShortFromNumberList } from '../../../utils/monthConversion';

const LSIRScoreChangeSnapshot = (props) => {
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

  const months = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3];
  const monthNamesShort = monthNamesShortFromNumberList(months);

  const chart = (
    <Line
      id="lsir-score-change-snapshot-chart"
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
          data: [0.26, 0.40, 0.90, 0.28, 0.42, 0.41, 0.72, -0.09, -0.10, 0.29,
            -0.44, -0.30, 0.07],
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
              labelString: 'Month of supervision termination',
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
              min: -1.5,
              max: 1.5,
            },
            scaleLabel: {
              display: true,
              labelString: 'change in LSIR scores',
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
            value: -1,

            // optional annotation ID (must be unique)
            id: 'lsir-score-change-snapshot-goal-line',
            scaleID: 'y-axis-0',

            drawTime: 'afterDatasetsDraw',

            borderColor: COLORS['red-400'],
            borderWidth: 2,
            borderDash: [2, 2],
            borderDashOffset: 5,
            label: {
              enabled: true,
              content: 'goal: -1.0',
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

  // TODO: Change this to have export for LSIR data
  const exportedStructureCallback = function exportedStructureCallback() {
    return {};
  };
  configureDownloadButtons('lsir-score-change', 'Snapshot', chart.props,
    document.getElementById('lsir-score-change-snapshot-chart'), exportedStructureCallback);

  const header = document.getElementById('LSIRScoreChangeSnapshot-header');

  // TODO: Make trending text dynamic based on goal and slope of trendline
  if (header) {
    const str1 = 'The change in LSIR scores between intake and termination of supervision has been';
    const str2 = "<b style='color:#809AE5'> trending towards the goal. </b>";
    header.innerHTML = str1.concat(str2);
  }

  return (chart);
};

export default LSIRScoreChangeSnapshot;
