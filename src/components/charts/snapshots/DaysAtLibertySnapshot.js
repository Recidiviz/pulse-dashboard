import React, { useState, useEffect } from 'react';

import { Line } from 'react-chartjs-2';
import { configureDownloadButtons } from '../../../assets/scripts/charts/chartJS/downloads';
import { COLORS } from '../../../assets/scripts/constants/colors';
import { monthNamesWithYearsFromNumbers } from '../../../utils/monthConversion';
import { sortAndFilterMostRecentMonths } from '../../../utils/dataOrganizing';

const DaysAtLibertySnapshot = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  const processResponse = () => {
    const { daysAtLibertyByMonth } = props;

    if (daysAtLibertyByMonth) {
      const dataPoints = [];

      daysAtLibertyByMonth.forEach((data) => {
        const { year, month } = data;
        const average = parseFloat(data.avg_liberty).toFixed(2);
        dataPoints.push([year, month, average]);
      });

      const sorted = sortAndFilterMostRecentMonths(dataPoints, 13);

      setChartLabels(monthNamesWithYearsFromNumbers(sorted.map((element) => element[1]), true));
      setChartDataPoints(sorted.map((element) => element[2]));
    }
  };

  useEffect(() => {
    processResponse();
  }, [props.daysAtLibertyByMonth]);

  const chart = (
    <Line
      id="days-at-liberty-snapshot-chart"
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

  const exportedStructureCallback = function exportedStructureCallback() {
    return {
      metric: 'average-days-at-liberty-reincarcerations',
      series: [],
    };
  };
  configureDownloadButtons('daysAtLiberty', 'Snapshot', chart.props,
    document.getElementById('days-at-liberty-snapshot-chart'), exportedStructureCallback);

  const header = document.getElementById(props.header);

  // TODO: Make trending text dynamic based on goal and slope of trendline
  if (header) {
    const title = `The average days between release from incarceration and readmission has been <b style='color:#809AE5'>trending away from the goal.</b>`;
    header.innerHTML = title;
  }

  return (chart);
};

export default DaysAtLibertySnapshot;
