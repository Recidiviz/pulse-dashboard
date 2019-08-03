import React, { useState, useEffect } from "react";

import { Line } from 'react-chartjs-2';
import { configureDownloadButtons } from "../../../assets/scripts/charts/chartJS/downloads";
import { COLORS, COLORS_STACKED_TWO_VALUES } from "../../../assets/scripts/constants/colors";

const ReincarcerationCountSnapshot = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [admissionDataPoints, setAdmissionDataPoints] = useState([]);
  const [reincarcerationDataPoints, setReincarcerationDataPoints] = useState([]);

  const processResponse = () => {
    const admissions = props.admissions;
    const reincarcerationsByMonth = props.reincarcerationCountsByMonth;

    if (!admissions || !reincarcerationsByMonth) {
      return;
    }

    var sorted = [];
    for (var month in reincarcerationsByMonth) {
      sorted.push([month, reincarcerationsByMonth[month]]);
    }

    setChartLabels(sorted.map(element => element[0]));
    setReincarcerationDataPoints(sorted.map(element => element[1]));
    setAdmissionDataPoints(admissions);
  }

  useEffect(() => {
    processResponse();
  }, [props.admissions, props.reincarcerationCountsByMonth]);

  const chart =
    <Line id='reincarceration-snapshot-chart' data={{
      labels: chartLabels,
      datasets: [{
        label: 'Total admissions',
        backgroundColor: COLORS['grey-300'],
        pointBackgroundColor: COLORS_STACKED_TWO_VALUES[0],
        pointRadius: function(context) {
          if (context.dataIndex === context.dataset.data.length-1) {
            return 4;
          } else {
            return 0;
          }
        },
        hitRadius: 5,
        fill: false,
        lineTension: 0,
        borderWidth: 2,
        data: admissionDataPoints,
      }, {
        label: 'Reincarceration returns',
        backgroundColor: COLORS['grey-300'],
        pointBackgroundColor: COLORS_STACKED_TWO_VALUES[1],
        pointRadius: function(context) {
          if (context.dataIndex === context.dataset.data.length-1) {
            return 4;
          } else {
            return 0;
          }
        },
        hitRadius: 5,
        fill: false,
        lineTension: 0,
        borderWidth: 2,
        data: reincarcerationDataPoints,
      }],
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
        events: ['click'],
        annotations: [{
          type: 'line',
          mode: 'horizontal',
          value: 17,

          // optional annotation ID (must be unique)
          id: 'recidivism-snapshot-goal-line',
          scaleID: 'y-axis-0',

          drawTime: 'afterDatasetsDraw',

          borderColor: COLORS['red-200'],
          borderWidth: 2,
          borderDash: [2, 2],
          borderDashOffset: 5,
          label: {
            enabled: false,
            content: 'Goal',
            position: 'center',

            // Background color of label, default below
            backgroundColor: 'rgba(0,0,0,0.1)',

            fontFamily: 'sans-serif',
            fontSize: 12,
            fontStyle: 'bold',
            fontColor: '#000',

            // Adjustment along x-axis (left-right) of label relative to above
            // number (can be negative). For horizontal lines positioned left
            // or right, negative values move the label toward the edge, and
            // positive values toward the center.
            xAdjust: 0,

            // Adjustment along y-axis (top-bottom) of label relative to above
            // number (can be negative). For vertical lines positioned top or
            // bottom, negative values move the label toward the edge, and
            // positive values toward the center.
            yAdjust: 0,
          },

          onClick(e) { return e; },
        }, {
          drawTime: 'beforeDatasetsDraw',
          type: 'box',
          xScaleID: 'x-axis-0',
          yScaleID: 'y-axis-0',
          xMin: 'June',
          xMax: 'September',
          yMin: 0,
          yMax: 100,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          borderColor: 'black',
          borderWidth: 1,
          onClick(e) { return e; },
        }],
      },
    }}
    />

  const exportedStructureCallback = function () {
    return {
      recidivismType: 'reincarceration',
      returnType: 'new_offenses',
      startDate: '2018-11',
      endDate: '2019-04',
      series: [],
    };
  };
  configureDownloadButtons('reincarceration', 'Snapshot', chart.props,
    document.getElementById('reincarceration-snapshot-chart'), exportedStructureCallback
  );

  return (chart);
}

export default ReincarcerationCountSnapshot;
