import React, { useState, useEffect } from 'react';

import { Line } from 'react-chartjs-2';
import { configureDownloadButtons } from '../../../assets/scripts/charts/chartJS/downloads';
import { COLORS } from '../../../assets/scripts/constants/colors';
import { monthNamesWithYearsFromNumbers, monthNamesFromShortName } from '../../../utils/monthConversion';
import { sortAndFilterMostRecentMonths } from '../../../utils/dataOrganizing';

const RevocationAdmissionsSnapshot = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  const processResponse = () => {
    const { revocationAdmissionsByMonth: countsByMonth } = props;

    if (countsByMonth) {
      const dataPoints = [];

      countsByMonth.forEach((data) => {
        const { year, month } = data;
        const newAdmissions = parseInt(data.new_admissions, 10);
        const technicals = parseInt(data.technicals, 10);
        const nonTechnicals = parseInt(data.non_technicals, 10);
        const unknownRevocations = parseInt(data.unknown_revocations, 10);
        const total = technicals + nonTechnicals + unknownRevocations + newAdmissions;
        const revocations = (technicals + nonTechnicals + unknownRevocations);
        const percentRevocations = (100 * (revocations / total)).toFixed(2);
        dataPoints.push([year, month, percentRevocations]);
      });

      const sorted = sortAndFilterMostRecentMonths(dataPoints, 13);

      setChartLabels(monthNamesWithYearsFromNumbers(sorted.map((element) => element[1]), true));
      setChartDataPoints(sorted.map((element) => element[2]));
    }
  };

  useEffect(() => {
    processResponse();
  }, [props.revocationAdmissionsByMonth]);

  const chart = (
    <Line
      id="revocation-admissions-snapshot-chart"
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
              labelString: 'Month',
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
              min: 30,
              max: 100,
            },
            scaleLabel: {
              display: true,
              labelString: '% of admissions',
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
            value: 40,

            // optional annotation ID (must be unique)
            id: 'revocation-admissions-snapshot-goal-line',
            scaleID: 'y-axis-0',

            drawTime: 'afterDatasetsDraw',

            borderColor: COLORS['red-400'],
            borderWidth: 2,
            borderDash: [2, 2],
            borderDashOffset: 5,
            label: {
              enabled: true,
              content: 'goal: 40%',
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
      metric: 'percentage-of-admissions-from-revocations',
      series: [],
    };
  };
  configureDownloadButtons('revocationAdmissions', 'Snapshot', chart.props,
    document.getElementById('revocation-admissions-snapshot-chart'), exportedStructureCallback);

  const chartData = chart.props.data.datasets[0].data;
  const mostRecentValue = chartData[chartData.length - 1];

  const chartDataLabels = chart.props.data.labels;
  const mostRecentMonth = monthNamesFromShortName(chartDataLabels[chartDataLabels.length - 1]);

  const header = document.getElementById(props.header);

  if (header && mostRecentValue && mostRecentMonth) {
    const title = `<b style='color:#809AE5'>${mostRecentValue}% of prison admissions</b> in ${mostRecentMonth} were due to parole or probation revocations.`;
    header.innerHTML = title;
  }

  return (chart);
};

export default RevocationAdmissionsSnapshot;
