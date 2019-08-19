import React, { useState, useEffect } from 'react';

import { Line } from 'react-chartjs-2';
import { trendlineLinear } from 'chartjs-plugin-trendline';
import { configureDownloadButtons } from '../../../assets/scripts/charts/chartJS/downloads';
import { COLORS } from '../../../assets/scripts/constants/colors';
import { monthNamesShortWithYearsFromNumberList, monthNamesFromShortName } from '../../../utils/monthConversion';


const RevocationAdmissionsSnapshot = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  // TODO: Update this to process supervision success data
  const processResponse = () => {
    const countsByMonth = props.revocationAdmissionsByMonth;

    var sorted = [];
    for (var month in countsByMonth) {
      sorted.push([month, countsByMonth[month]]);
    }

    setChartLabels(monthNamesShortWithYearsFromNumberList(sorted.map((element) => element[0])));
    setChartDataPoints(sorted.map((element) => element[1]));
  };

  useEffect(() => {
    processResponse();
  }, [props.revocationAdmissionsByMonth]);

  // const months = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3];
  // const monthNamesShort = monthNamesShortFromNumberList(months);

  const chart = (
    <Line
      id="revocation-admissions-snapshot-chart"
      data={{
        labels: chartLabels,
        datasets: [{
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

  // TODO: Change this to have export for revocation admissions data
  const exportedStructureCallback = function exportedStructureCallback() {
    return {};
  };
  configureDownloadButtons('revocation-admissions', 'Snapshot', chart.props,
    document.getElementById('revocation-admissionssnapshot-chart'), exportedStructureCallback);

  const chartData = chart.props.data.datasets[0].data;
  const mostRecentValue = chartData[chartData.length - 1];

  const chartDataLabels = chart.props.data.labels;
  const mostRecentMonth = monthNamesFromShortName(chartDataLabels[chartDataLabels.length - 1]);

  // const header = document.getElementById('revocationAdmissionsSnapshot-header');
  //
  // if (header) {
  //   const str1 = "<b style='color:#809AE5'>";
  //   const str2 = `${mostRecentValue}`;
  //   const str3 = '% of prison admissions </b> in ';
  //   const str4 = `${mostRecentMonth}`;
  //   const str5 = ' were due to parole or probation revocations.';
  //   header.innerHTML = str1.concat(str2, str3, str4, str5);
  // }

  return (chart);
};

export default RevocationAdmissionsSnapshot;
