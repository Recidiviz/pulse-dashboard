import React, { useState, useEffect } from "react";

import { Line } from 'react-chartjs-2';
import { configureDownloadButtons } from "../../../assets/scripts/charts/chartJS/downloads";
import { COLORS } from "../../../assets/scripts/constants/colors";
import { monthNamesFromNumberList } from "../../../utils/monthConversion";

const RevocationCountOverTime = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  const processResponse = () => {
    const countsByMonth = props.revocationCountsByMonth;

    var sorted = [];
    countsByMonth.forEach(function (data) {
      const year = data.year;
      const month = data.month;
      const count = data.revocation_count;
      sorted.push([year, month, count]);
    });

    // Sort by month and year
    sorted.sort(function(a, b) {
        if (a[0] === b[0]) {
          return a[1] - b[1];
        } else {
          return a[0] - b[0];
        }
    });

    // Just display the most recent 6 months
    sorted = sorted.slice(sorted.length - 6, sorted.length);

    setChartLabels(sorted.map(element => element[1]));
    setChartDataPoints(sorted.map(element => element[2]));
  }

  useEffect(() => {
    processResponse();
  }, [props.revocationCountsByMonth]);

  const chart =
    <Line id="revocation-drivers-chart" data={{
      labels: monthNamesFromNumberList(chartLabels),
      datasets: [{
        label: 'Total',
        borderColor: COLORS['grey-500'],
        pointBackgroundColor: COLORS['grey-700'],
        fill: false,
        borderWidth: 2,
        data: chartDataPoints,
      }],
    }}
    options={{
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxWidth: 10,
        },
      },
      scales: {
        xAxes: [{
          ticks: {
            autoSkip: false,
          },
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Revocation count',
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
          value: 42,

          // optional annotation ID (must be unique)
          id: 'revocation-drivers-goal-line',
          scaleID: 'y-axis-0',

          drawTime: 'afterDatasetsDraw',

          borderColor: 'red',
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
        }],
      },
    }}
    />

  const exportedStructureCallback = function () {
    return {
      recidivismType: 'reincarceration',
      returnType: 'revocations',
      startDate: '2018-11',
      endDate: '2019-04',
      series: [],
    };
  };
  configureDownloadButtons('revocation', 'Drivers', chart.props,
    document.getElementById('revocation-drivers-chart'), exportedStructureCallback
  );

  const chartData = chart.props.data.datasets[0].data;
  const mostRecentValue = chartData[chartData.length - 1];

  const chartDataLabels = chart.props.data.labels;
  const mostRecentMonth = chartDataLabels[chartDataLabels.length - 1];

  const header = document.getElementById(props.header);

  if (header && mostRecentValue && mostRecentMonth) {
    const title = `There have been <b style='color:#809AE5'>${mostRecentValue} revocations</b> this month so far.`;
    header.innerHTML = title;
  }

  return (chart);
}

export default RevocationCountOverTime;
