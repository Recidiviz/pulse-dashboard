import React, { useState, useEffect } from "react";

import { Line } from 'react-chartjs-2';
import { configureDownloadButtons } from "../../../assets/scripts/charts/chartJS/downloads";
import { COLORS, COLORS_THREE_VALUES } from "../../../assets/scripts/constants/colors";

const RevocationCountSnapshot = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  const processResponse = () => {
    const countsByMonth = props.revocationCountsByMonth;

    var sorted = [];
    for (var month in countsByMonth) {
      sorted.push([month, countsByMonth[month]]);
    }

    setChartLabels(sorted.map(element => element[0]));
    setChartDataPoints(sorted.map(element => element[1]));
  }

  useEffect(() => {
    processResponse();
  }, [props.revocationCountsByMonth]);

  const chart = (
  <Line id='revocation-snapshot-chart'  data={{
    labels: ["Mar '18",  'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', "Jan '19", 'Feb', 'Mar'],
    datasets: [{
      backgroundColor: COLORS['blue-standard'],
      pointBackgroundColor: COLORS['blue-standard'],
      pointRadius: function(context) {
        if (context.dataIndex === context.dataset.data.length-1) {
          return 4;
        } else {
          return 4;
        }
      },
      hitRadius: 5,
      fill: false,
      borderWidth: 2,
      lineTension: 0,
      data: [69.3284936, 68.6486486, 66.4884135, 66.730038, 69.2449355, 69.2176871, 66.9921875, 67.1821306, 65.7250471, 68.2600382, 69.61325967, 65.0671785, 47.5308642],
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
          autoSkip: false,
        },
        gridLines: {
          color: "rgba(0, 0, 0, 0)",
        },
      }],
      yAxes: [{
        ticks: {
          max: 100,
        },
        scaleLabel: {
          display: true,
          labelString: 'Counts',
        },
        gridLines: {
          color: "rgba(0, 0, 0, 0)",
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
        id: 'revocation-snapshot-goal-line',
        scaleID: 'y-axis-0',

        drawTime: 'afterDatasetsDraw',

        borderColor: COLORS['red-200'],
        borderWidth: 2,
        borderDash: [2, 2],
        borderDashOffset: 5,
        label: {
          enabled: true,
          content: 'goal: 75%',
          position: 'right',

          // Background color of label, default below
          backgroundColor: 'rgba(0,0,0,0)',

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
          yAdjust: -15,
        },

        onClick(e) { return e; },
      }],
    },
  }}
  />);

  const exportedStructureCallback = function () {
    return {
      recidivismType: 'reincarceration',
      returnType: 'revocations',
      startDate: '2018-11',
      endDate: '2019-04',
      series: [],
    };
  };
  configureDownloadButtons('revocation', 'Snapshot', chart.props,
    document.getElementById('revocation-snapshot-chart'), exportedStructureCallback);

return (chart);
}

export default RevocationCountSnapshot;
