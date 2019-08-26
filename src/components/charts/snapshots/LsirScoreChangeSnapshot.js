import React, { useState, useEffect } from 'react';

import { Line } from 'react-chartjs-2';
import { configureDownloadButtons } from '../../../assets/scripts/charts/chartJS/downloads';
import { COLORS } from '../../../assets/scripts/constants/colors';
import { monthNamesWithYearsFromNumbers } from '../../../utils/monthConversion';
import { sortAndFilterMostRecentMonths } from '../../../utils/dataOrganizing';
import { generateTrendlineDataset, getTooltipWithoutTrendline } from '../../../utils/trendline';
import { getGoalForChart, trendlineGoalText } from '../../../utils/metricGoal';

const LsirScoreChangeSnapshot = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  const GOAL = getGoalForChart('US_ND', 'lsir-score-change-snapshot-chart');

  const processResponse = () => {
    const { lsirScoreChangeByMonth: changeByMonth } = props;

    if (changeByMonth) {
      const dataPoints = [];

      changeByMonth.forEach((data) => {
        const { termination_year: year, termination_month: month } = data;
        const change = parseFloat(data.average_change).toFixed(2);

        dataPoints.push([year, month, change]);
      });

      const sorted = sortAndFilterMostRecentMonths(dataPoints, 13);

      setChartLabels(monthNamesWithYearsFromNumbers(sorted.map((element) => element[1]), true));
      setChartDataPoints(sorted.map((element) => element[2]));
    }
  };

  useEffect(() => {
    processResponse();
  }, [props.lsirScoreChangeByMonth]);

  const chart = (
    <Line
      id="lsir-score-change-snapshot-chart"
      data={{
        labels: chartLabels,
        datasets: [{
          label: 'data',
          backgroundColor: COLORS['blue-standard'],
          borderColor: COLORS['blue-standard'],
          pointBackgroundColor: COLORS['blue-standard'],
          pointRadius: 4,
          hitRadius: 5,
          fill: false,
          borderWidth: 2,
          lineTension: 0,
          data: chartDataPoints,
        }, generateTrendlineDataset(chartDataPoints, COLORS['blue-standard-light']),
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
          mode: 'point',
          callbacks: {
            label: (tooltipItem, data) => (getTooltipWithoutTrendline(tooltipItem, data)),
          },
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
              labelString: 'Change in LSIR scores',
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
            value: GOAL.value,

            // optional annotation ID (must be unique)
            id: 'lsir-score-change-snapshot-goal-line',
            scaleID: 'y-axis-0',

            drawTime: 'afterDatasetsDraw',

            borderColor: COLORS['red-standard'],
            borderWidth: 2,
            borderDash: [2, 2],
            borderDashOffset: 5,
            label: {
              enabled: true,
              content: 'goal: '.concat(GOAL.label),
              position: 'right',

              // Background color of label, default below
              backgroundColor: 'rgba(0, 0, 0, 0)',

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
              yAdjust: 10,
            },

            onClick(e) { return e; },
          }],
        },
      }}
    />
  );

  const exportedStructureCallback = function exportedStructureCallback() {
    return {
      metric: 'average-change-in-LSIR-score-termination-intake',
      series: [],
    };
  };
  configureDownloadButtons('LsirScoreChange', 'Snapshot', chart.props,
    document.getElementById('lsir-score-change-snapshot-chart'), exportedStructureCallback);

  const header = document.getElementById(props.header);
  const trendlineValues = chart.props.data.datasets[1].data;
  const trendlineText = trendlineGoalText(trendlineValues, GOAL);

  if (header) {
    const title = `The average change in LSIR scores between intake and termination of supervision has been <b style='color:#809AE5'> trending ${trendlineText}. </b>`;
    header.innerHTML = title;
  }

  return (chart);
};

export default LsirScoreChangeSnapshot;
