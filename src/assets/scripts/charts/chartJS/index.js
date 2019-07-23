// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2018 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================

import * as $ from 'jquery';

import Chart from 'chart.js';
// import FunnelChart from 'chartjs-funnel';
import ChartAnnotationsPlugin from 'chartjs-plugin-annotation';

import {
  configureDriverRadioButtons, configureExplorationCheckboxes,
  recalibrateDatasetsForExplorationChart,
} from './dynamicData';

import {
  COLORS, COLORS_GOOD_BAD, COLORS_STACKED_TWO_VALUES,
  COLORS_FIVE_VALUES, COLORS_THREE_VALUES, COLORS_FIVE_VALUES_LIGHT,
} from '../../constants/colors';
import { configureDownloadButtons } from './downloads';

export default (function () {
  // Extras required for our Chart.js configuration
  Chart.plugins.register(ChartAnnotationsPlugin);

  // ------------------------------------------------------
  // Snapshot Charts ======================================
  // ------------------------------------------------------

  const recidivismSnapshotChartBox = document.getElementById('recidivism-snapshot-chart');

  if (recidivismSnapshotChartBox) {
    const recidivismSnapshotChartCtx = recidivismSnapshotChartBox.getContext('2d');
    recidivismSnapshotChartBox.height = 160;

    const recidivismSnapshotChart = new Chart(recidivismSnapshotChartCtx, {
      type: 'line',
      data: {
        labels: ['November', 'December', 'January', 'February', 'March', 'April'],
        datasets: [{
          label: 'Total admissions',
          backgroundColor: COLORS['grey-300'],
          pointBackgroundColor: COLORS_STACKED_TWO_VALUES[0],
          pointRadius: function(context) {
             if (context.dataIndex == context.dataset.data.length-1) {
                return 4;
             } else {
                return 0; }
              },
          hitRadius: 5,
          fill: false,
          lineTension: 0,
          borderWidth: 2,
          data: [108, 97, 130, 113, 127, 115],
        }, {
          label: 'Reincarceration returns',
          backgroundColor: COLORS['grey-300'],
          pointBackgroundColor: COLORS_STACKED_TWO_VALUES[1],
          pointRadius: function(context) {
             if (context.dataIndex == context.dataset.data.length-1) {
                return 4;
             } else {
                return 0; }
              },
          hitRadius: 5,
          fill: false,
          lineTension: 0,
          borderWidth: 2,
          data: [33, 10, 25, 27, 34, 31],
        }],
      },

      options: {
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
      },
    });

    const exportedStructureCallback = function () {
      return {
        recidivismType: 'reincarceration',
        returnType: 'new_offenses',
        startDate: '2018-11',
        endDate: '2019-04',
        series: [],
      };
    };
    configureDownloadButtons(
      'recidivism', 'Snapshot', recidivismSnapshotChart,
      recidivismSnapshotChartBox, exportedStructureCallback,
    );
  }

  const revocationSnapshotChartBox = document.getElementById('revocations-snapshot-chart');

  if (revocationSnapshotChartBox) {
    const revocationSnapshotChartCtx = revocationSnapshotChartBox.getContext('2d');
    revocationSnapshotChartBox.height = 160;

    const revocationSnapshotChart = new Chart(revocationSnapshotChartCtx, {
      type: 'line',
      data: {
        labels: ['November', 'December', 'January', 'February', 'March', 'April'],
        datasets: [{
          label: 'Total revocations',
          backgroundColor: COLORS['grey-300'],
          pointBackgroundColor: COLORS_THREE_VALUES[0],
          pointRadius: function(context) {
             if (context.dataIndex == context.dataset.data.length-1) {
                return 4;
             } else {
                return 0; }
              },
          fill: false,
          borderWidth: 2,
          lineTension: 0,
          data: [40, 48, 60, 44, 54, 52],
        },{
          label: 'Technical revocations',
          backgroundColor: COLORS['grey-300'],
          pointBackgroundColor: COLORS_THREE_VALUES[1],
          pointRadius: function(context) {
             if (context.dataIndex == context.dataset.data.length-1) {
                return 4;
             } else {
                return 0; }
              },
          fill: false,
          borderWidth: 2,
          lineTension: 0,
          data: [20, 28, 32, 24, 31, 32],
        },{
          label: 'Non-Technical revocations',
          backgroundColor: COLORS['grey-300'],
          pointBackgroundColor: COLORS_THREE_VALUES[2],
          pointRadius: function(context) {
             if (context.dataIndex == context.dataset.data.length-1) {
                return 4;
             } else {
                return 0; }
              },
          fill: false,
          lineTension: 0,
          borderWidth: 2,
          data: [20, 20, 28, 20, 23, 20],
        }],
      },

      options: {
        legend: {
          display: false,
          position: 'right',
          labels: {
            usePointStyle: true,
            boxWidth: 5,
          },
        },
        tooltips: {
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
              beginAtZero: true,
            },
            gridLines: {
                color: "rgba(0, 0, 0, 0)",
            },
            scaleLabel: {
              display: true,
              labelString: 'Counts',
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
            value: 42,

            // optional annotation ID (must be unique)
            id: 'revocation-snapshot-goal-line',
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
          }],
          // }, {
          //   drawTime: 'beforeDatasetsDraw',
          //   type: 'box',
          //   xScaleID: 'x-axis-0',
          //   yScaleID: 'y-axis-0',
          //   xMin: 'June',
          //   xMax: 'September',
          //   yMin: 0,
          //   yMax: 100,
          //   backgroundColor: 'rgba(0, 0, 0, 0.1)',
          //   borderColor: 'black',
          //   borderWidth: 1,
          //   onClick(e) { return e; },
          // }],
        },
      },
    });

    const exportedStructureCallback = function () {
      return {
        recidivismType: 'reincarceration',
        returnType: 'revocations',
        startDate: '2018-11',
        endDate: '2019-04',
        series: [],
      };
    };
    configureDownloadButtons(
      'revocation', 'Snapshot', revocationSnapshotChart,
      revocationSnapshotChartBox, exportedStructureCallback,
    );
  }

  // ------------------------------------------------------
  // Revocation Module Charts =============================
  // ------------------------------------------------------

  const revocationDriversChartBox = document.getElementById('revocation-drivers-chart');

  if (revocationDriversChartBox) {
    const revocationDriversChartCtx = revocationDriversChartBox.getContext('2d');
    revocationDriversChartBox.height = 160;

    const baselineRevocationDataset = {
      label: 'Total',
      borderColor: COLORS['grey-500'],
      pointBackgroundColor: COLORS['grey-700'],
      fill: false,
      borderWidth: 2,
      data: [40, 48, 60, 44, 54, 52],
    };

    const revocationDriversChart = new Chart(revocationDriversChartCtx, {
      type: 'line',
      data: {
        labels: ['November', 'December', 'January', 'February', 'March', 'April'],
        datasets: [baselineRevocationDataset],
      },

      options: {
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
      },
    });

    const exportedStructureCallback = function () {
      return {
        recidivismType: 'reincarceration',
        returnType: 'revocations',
        startDate: '2018-11',
        endDate: '2019-04',
        series: [],
      };
    };
    configureDownloadButtons(
      'revocation', 'Drivers', revocationDriversChart,
      revocationDriversChartBox, exportedStructureCallback,
    );
  }

  const returnTypeFunnelChartBox = document.getElementById('return-funnel-chart');

  if (returnTypeFunnelChartBox) {
    const returnTypeFunnelCtx = returnTypeFunnelChartBox.getContext('2d');
    returnTypeFunnelChartBox.height = 160;

    new Chart(returnTypeFunnelCtx, {
      type: 'funnel',
      data: {
        datasets: [{
          data: [83, 74, 67, 37],
          backgroundColor: [
            COLORS['pink-300'],
            COLORS['teal-300'],
            COLORS['amber-300'],
            COLORS['indigo-300'],
          ],
          hoverBackgroundColor: [
            COLORS['pink-300'],
            COLORS['teal-300'],
            COLORS['amber-300'],
            COLORS['indigo-300'],
          ],
        }],
        labels: [
          'Documented violations',
          'Graduated sanctions',
          'Motions to revoke',
          'Revocations',
        ],
      },
      options: {
        responsive: true,
        legend: {
          position: 'right',
        },
        sort: 'desc',
      },
    });
  }

  const returnTypePieChartBox = document.getElementById('return-pie-chart');

  if (returnTypePieChartBox) {
    const returnTypePieCtx = returnTypePieChartBox.getContext('2d');
    returnTypePieChartBox.height = 160;

    new Chart(returnTypePieCtx, {
      type: 'pie',
      data: {
        datasets: [{
          data: [121, 40, 48, 11, 29],
          backgroundColor: COLORS_FIVE_VALUES,
          hoverBackgroundColor: COLORS_FIVE_VALUES,
        }],
        labels: [
          'New admissions',
          'Non-technical revocations',
          'Technical revocations',
          'Other',
          'Unknown',
        ],
      },
      options: {
        responsive: true,
        legend: {
          position: 'right',
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              //get the concerned dataset
              var dataset = data.datasets[tooltipItem.datasetIndex];
              //calculate the total of this data set
              var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
                return previousValue + currentValue;
              });
              //get the current items value
              var currentValue = dataset.data[tooltipItem.index];
              //calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
              var percentage = Math.floor(((currentValue/total) * 100)+0.5);

              return data.labels[tooltipItem.index] + ": " + currentValue + ' (' + percentage + '%)';
            }
          }
        },
      },
    });
  }

  const revocationsBySupervisionTypeBox = document.getElementById('revocations-by-supervision-type-bar-chart');

  if (revocationsBySupervisionTypeBox) {
    const revocationsBySupervisionTypeBarChartCtx = revocationsBySupervisionTypeBox.getContext('2d');

    new Chart(revocationsBySupervisionTypeBarChartCtx, {
      type: 'bar',
      data: {
        labels: ['November', 'December', 'January', 'February', 'March', 'April'],
        datasets: [{
            label: 'Probation',
            type: 'bar',
            backgroundColor: COLORS_STACKED_TWO_VALUES[0],
            data: [9, 10, 12, 10, 17, 16],
          }, {
            label: 'Parole',
            type: 'bar',
            backgroundColor: COLORS_STACKED_TWO_VALUES[1],
            data: [31, 38, 48, 34, 37, 36],
          },
        ],
      },
      options: {
        responsive: true,
        legend: {
          position: 'bottom',
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Month',
            },
            stacked: true,
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Revocation counts',
            },
            stacked: true,
          }],
        },
      },
    });
  }

  const revocationsByViolationTypeBox = document.getElementById('revocations-by-violation-type-bar-chart');

  if (revocationsByViolationTypeBox) {
    const revocationsByViolationTypeBarChartCtx = revocationsByViolationTypeBox.getContext('2d');

    new Chart(revocationsByViolationTypeBarChartCtx, {
      type: 'bar',
      data: {
        labels: ['November', 'December', 'January', 'February', 'March', 'April'],
        datasets: [{
            label: "Absconsion",
            backgroundColor: COLORS_FIVE_VALUES[0],
            data: [9, 10, 12, 10, 17, 16],
          }, {
            label: "Felony",
            backgroundColor: COLORS_FIVE_VALUES[1],
            data: [31, 38, 48, 34, 37, 36],
          }, {
            label: "Misdemeanor",
            backgroundColor: COLORS_FIVE_VALUES[2],
            data: [12, 8, 4, 34, 37, 36],
          }, {
            label: "Municipal",
            backgroundColor: COLORS_FIVE_VALUES[3],
            data: [31, 2, 48, 22, 12, 36],
          }, {
            label: "Technical",
            backgroundColor: COLORS_FIVE_VALUES[4],
            data: [3, 12, 8, 3, 31, 6],
          },
        ],
      },
      options: {
        responsive: true,
        legend: {
          position: 'bottom',
          boxWidth: 10,
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Month',
            },
            stacked: true,
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Revocation counts',
            },
            stacked: true,
          }],
        },
      },
    });
  }

  const revocationsByOfficerBarChartBox = document.getElementById('revocations-by-officer-bar-chart');

  if (revocationsByOfficerBarChartBox) {
    const revocationsByOfficerBarChartCtx = revocationsByOfficerBarChartBox.getContext('2d');

    new Chart(revocationsByOfficerBarChartCtx, {
      type: 'bar',
      data: {
        labels: ['#176', '#46', '#143', '#702', '#125', '#139', '#142', '#165'],
        datasets: [{
          label: 'Non-Technical',
          backgroundColor: COLORS_STACKED_TWO_VALUES[0],
          borderColor: COLORS_STACKED_TWO_VALUES[0],
          borderWidth: 1,
          data: [2, 5, 4, 0, 1, 4, 1, 4],
        }, {
          label: 'Technical',
          backgroundColor: COLORS_STACKED_TWO_VALUES[1],
          borderColor: COLORS_STACKED_TWO_VALUES[1],
          borderWidth: 1,
          data: [7, 2, 2, 6, 4, 1, 4, 1],
        }],
      },
      options: {
        responsive: true,
        legend: {
          position: 'top',
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Officer id',
            },
            stacked: true,
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Revocation counts',
            },
            stacked: true,
          }],
        },
      },
    });
  }

  const revocationsByRaceBarChartBox = document.getElementById('revocations-by-race-bar-chart');

  if (revocationsByRaceBarChartBox) {
    const revocationsByRaceBarChartCtx = revocationsByRaceBarChartBox.getContext('2d');

    new Chart(revocationsByRaceBarChartCtx, {
      type: 'horizontalBar',
      data: {
        labels: ['Revocations', 'ND Population'],
        datasets: [{
            label: 'American Indian Alaskan Native',
            backgroundColor: COLORS_FIVE_VALUES[0],
            data: [30.0, 5.4],
          }, {
            label: 'Asian',
            backgroundColor: COLORS_FIVE_VALUES[1],
            data: [0, 1],
          }, {
            label: 'Black',
            backgroundColor: COLORS_FIVE_VALUES[2],
            data: [5.7, 1.2],
          }, {
            label: 'Native Hawaiian Pacific Islander',
            backgroundColor: COLORS_FIVE_VALUES[3],
            data: [0, 0.1],
          }, {
            label: 'White',
            backgroundColor: COLORS_FIVE_VALUES[4],
            data: [57.7, 90],
          }, {
            label: 'Other',
            backgroundColor: COLORS['blue-standard'],
            data: [6.6, 2.3],
          },
        ],
      },
      options: {
        scales: {
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Percentage',
              },
                stacked: true
            }],
            yAxes: [{
                stacked: true
            }]
        },
        responsive: true,
        legend: {
          position: 'bottom',
        },
        tooltips: {
          mode: 'dataset',
          intersect: true,
          callbacks: {
            label: function(tooltipItem, data) {
              //get the concerned dataset
              var dataset = data.datasets[tooltipItem.datasetIndex];
              //get the current items value
              var currentValue = dataset.data[tooltipItem.index];

              return dataset.label + ": " + currentValue + '% of ' + data.labels[tooltipItem.index];
            },
          },
        },
      },
    });
  }

  const revocationsByGenderBarChartBox = document.getElementById('revocations-by-gender-bar-chart');

  if (revocationsByGenderBarChartBox) {
    const revocationsByGenderBarChartCtx = revocationsByGenderBarChartBox.getContext('2d');

    new Chart(revocationsByGenderBarChartCtx, {
      type: 'horizontalBar',
      data: {
        labels: ['Revocations this month', 'North Dakota Population', ],
        datasets: [{
          label: ['Male'],
          backgroundColor: COLORS_STACKED_TWO_VALUES[0],
          borderWidth: 1,
          data: [75, 51],
        }, {
          label: ['Female'],
          backgroundColor: COLORS_STACKED_TWO_VALUES[1],
          borderWidth: 1,
          data: [25, 49],
        }],
      },
      options: {
        scales: {
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Percentage',
              },
                stacked: true
            }],
            yAxes: [{
                stacked: true
            }]
        },
        responsive: true,
        legend: {
          position: 'top',
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
      },
    });
  }

  const violationsBeforeRecommendationByOfficerBarChartBox = document.getElementById('violations-before-recommendation-by-officer-bar-chart');

  if (violationsBeforeRecommendationByOfficerBarChartBox) {
    const violationsBeforeRecommendationByOfficerBarChartCtx = violationsBeforeRecommendationByOfficerBarChartBox.getContext('2d');

    new Chart(violationsBeforeRecommendationByOfficerBarChartCtx, {
      type: 'bar',
      data: {
        labels: ['C. Baker', 'F. Black', 'R. Coleman', 'R. Francis', 'A. Reyes', 'S. Smith', 'J. Williams'],
        datasets: [{
          label: 'Typical',
          backgroundColor: COLORS['pink-300'],
          borderColor: COLORS['pink-300'],
          borderWidth: 1,
          data: [3.4, 2.1, 4.2, 2.0, 1.8, 2.1, 3.7],
        }, {
          label: 'Sexual',
          backgroundColor: COLORS['teal-300'],
          borderColor: COLORS['teal-300'],
          borderWidth: 1,
          data: [0, 1.4, 0, 2.0, 0, 0, 0],
        }, {
          label: 'Psychological',
          backgroundColor: COLORS['indigo-300'],
          borderColor: COLORS['indigo-300'],
          borderWidth: 1,
          data: [2.1, 0, 0, 2.9, 0, 1.4, 3.0],
        }],
      },
      options: {
        responsive: true,
        legend: {
          position: 'top',
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          xAxes: [{
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Average violations before recommendation',
            },
          }],
        },
      },
    });
  }

  // Functions for toggling of data on revocation exploration chart
  const revocationExplorationChartBox = document.getElementById('revocation-exploration-chart');

  if (revocationExplorationChartBox) {
    const revocationExplorationChartCtx = revocationExplorationChartBox.getContext('2d');
    revocationExplorationChartBox.height = 160;

    const baselineRevocationDataset = {
      label: 'Totals',
      borderColor: COLORS['grey-500'],
      pointBackgroundColor: COLORS['grey-700'],
      fill: false,
      borderDash: [10, 5],
      borderWidth: 2,
      data: [40, 48, 60, 44, 54, 52],
    };

    const revocationExplorationChart = new Chart(revocationExplorationChartCtx, {
      type: 'line',
      data: {
        labels: ['November', 'December', 'January', 'February', 'March', 'April'],
        datasets: [baselineRevocationDataset],
      },

      options: {
        legend: {
          display: true,
          position: 'right',
          labels: {
            usePointStyle: true,
            boxWidth: 20,
          },
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
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
          drawTime: 'afterDatasetsDraw',
          events: ['click'],

          // Array of annotation configuration objects
          // See below for detailed descriptions of the annotation options
          annotations: [{
            type: 'line',
            mode: 'horizontal',
            value: 42,

            // optional annotation ID (must be unique)
            id: 'revocation-exploration-goal-line',
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
      },
    });

    const enabledByRaceOption = {
      blackSubOption: false,
      hispanicSubOption: false,
      whiteSubOption: false,
    };

    const enabledByRevocationTypeOption = {
      nonTechnicalSubOption: false,
      technicalSubOption: false,
    };

    const enabledBySupervisionTypeOption = {
      paroleSubOption: false,
      probationSubOption: false,
    };

    const enabledByRiskOption = {
      lowSubOption: false,
      mediumSubOption: false,
      highSubOption: false,
    };

    const flagsByDimension = {
      race: enabledByRaceOption,
      revocationType: enabledByRevocationTypeOption,
      supervisionType: enabledBySupervisionTypeOption,
      risk: enabledByRiskOption,
    };

    const dimensions = ['race', 'revocationType', 'supervisionType'];
    configureExplorationCheckboxes(
      flagsByDimension, dimensions, revocationExplorationChart,
      'revocation_count',
    );

    const recalibrateDatasetsForDate = function () {
      return recalibrateDatasetsForExplorationChart(
        flagsByDimension, dimensions,
        revocationExplorationChart, 'revocation_count',
      );
    };

    $('#startDateSelection').on('change', recalibrateDatasetsForDate);
    $('#endDateSelection').on('change', recalibrateDatasetsForDate);

    const exportedStructureCallback = function () {
      return {
        recidivismType: 'reincarceration',
        returnType: 'revocations',
        startDate: $('#startDateSelection').val(),
        endDate: $('#endDateSelection').val(),
        series: [],
      };
    };
    configureDownloadButtons(
      'revocation', 'Exploration', revocationExplorationChart,
      revocationExplorationChartBox, exportedStructureCallback,
    );
  }

  // ------------------------------------------------------
  // Reincarceration Module Charts ========================
  // ------------------------------------------------------

  const recidivismDriversChartBox = document.getElementById('recidivism-drivers-chart');

  if (recidivismDriversChartBox) {
    const recidivismDriversChartCtx = recidivismDriversChartBox.getContext('2d');
    recidivismDriversChartBox.height = 160;

    const baselineRecidivismDataset = {
      label: 'Reincarceration returns',
      borderColor: COLORS['grey-500'],
      pointBackgroundColor: COLORS['grey-700'],
      fill: false,
      borderWidth: 2,
      data: [33, 10, 25, 27, 34, 31],
    };

    const recidivismDriversChart = new Chart(recidivismDriversChartCtx, {
      type: 'line',
      data: {
        labels: ['November', 'December', 'January', 'February', 'March', 'April'],
        datasets: [baselineRecidivismDataset],
      },

      options: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            usePointStyle: true,
            boxWidth: 20,
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
              labelString: 'Reincarceration count',
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
            value: 17,

            // optional annotation ID (must be unique)
            id: 'recidivism-drivers-goal-line',
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
      },
    });

    const exportedStructureCallback = function () {
      return {
        recidivismType: 'reincarceration',
        returnType: 'new_offenses',
        startDate: '2018-11',
        endDate: '2019-04',
        series: [],
      };
    };
    configureDownloadButtons(
      'recidivism', 'Drivers', recidivismDriversChart,
      recidivismDriversChartBox, exportedStructureCallback,
    );
  }

  const byFacilityBarChartBox = document.getElementById('by-facility-bar-chart');

  if (byFacilityBarChartBox) {
    const barCtx = byFacilityBarChartBox.getContext('2d');
    byFacilityBarChartBox.height = 80;

    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: [
          'DWCRC',
          'NDSP',
          'JRCC',
          'MRCC',
          'TRCC',
          'County Jails',
          'Out of State',
        ],
        datasets: [{
          label: 'Reincarceration rate',
          backgroundColor: COLORS['blue-standard'],
          borderWidth: 1,
          yAxisID: 'y-axis-left',
          data: [
            0.12195121951219512,
            0.2913752913752914,
            0.29393939393939394,
            0.23225806451612904,
            0.3458646616541353,
            0.3103448275862069,
            0.21428571428571427,
          ],
        }],
      },

      options: {
        responsive: true,
        legend: {
          display: 'bottom',
        },
        tooltips: {
          mode: 'index',
          callbacks: {
            label(tooltipItems, data) {
              const { index } = tooltipItems;
              if (data.datasets[tooltipItems.datasetIndex].label === 'Reincarceration rate') {
                return `${data.datasets[tooltipItems.datasetIndex].label}: ${(data.datasets[tooltipItems.datasetIndex].data[index] * 100).toFixed(2)}%`;
              }
              return `${data.datasets[tooltipItems.datasetIndex].label}: ${(data.datasets[tooltipItems.datasetIndex].data[index])}`;
            },
          },
        },
        scaleShowValues: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
            position: 'left',
            id: 'y-axis-left',
            scaleLabel: {
              display: true,
              labelString: 'Reincarceration rate',
            },
          }],
          xAxes: [{
            ticks: {
              autoSkip: false,
            },
            scaleLabel: {
              display: true,
              labelString: 'Facility',
            },
          }],
        },
      },
    });
  }

  const byTransitionalFacilityBarChartBox = document.getElementById('by-transitional-facility-bar-chart');

  if (byTransitionalFacilityBarChartBox) {
    const barCtx = byTransitionalFacilityBarChartBox.getContext('2d');
    byTransitionalFacilityBarChartBox.height = 80;

    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: [
          'FTPFAR',
          'GFC',
          'BTC',
          'FTPMND',
          'MTPFAR',
          'LRRP',
          'MTPMND',
        ],
        datasets: [{
          label: 'Reincarceration rate',
          backgroundColor: COLORS['blue-standard-2'],
          borderColor: COLORS['blue-standard-2'],
          borderWidth: 1,
          yAxisID: 'y-axis-left',
          data: [
            0.16363636363636364,
            0.1875,
            0.18981481481481483,
            0.2222222222222222,
            0.2898550724637681,
            0.3333333333333333,
            0.3333333333333333,
          ],
        }],
      },

      options: {
        responsive: true,
        legend: {
          display: 'bottom',
        },
        tooltips: {
          mode: 'index',
          callbacks: {
            label(tooltipItems, data) {
              const { index } = tooltipItems;
              if (data.datasets[tooltipItems.datasetIndex].label === 'Reincarceration rate') {
                return `${data.datasets[tooltipItems.datasetIndex].label}: ${(data.datasets[tooltipItems.datasetIndex].data[index] * 100).toFixed(2)}%`;
              }
              return `${data.datasets[tooltipItems.datasetIndex].label}: ${(data.datasets[tooltipItems.datasetIndex].data[index])}`;
            },
          },
        },
        scaleShowValues: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
            position: 'left',
            id: 'y-axis-left',
            scaleLabel: {
              display: true,
              labelString: 'Reincarceration rate',
            },
          }],
          xAxes: [{
            ticks: {
              autoSkip: false,
            },
            scaleLabel: {
              display: true,
              labelString: 'Facility',
            },
          }],
        },
      },
    });
  }

  const byStayLengthBarChartBox = document.getElementById('by-stay-length-bar-chart');

  if (byStayLengthBarChartBox) {
    const barCtx = byStayLengthBarChartBox.getContext('2d');
    byStayLengthBarChartBox.height = 80;

    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: [
          '0-12',
          '12-24',
          '24-36',
          '36-48',
          '48-60',
        ],
        datasets: [{
          label: 'Reincarceration rate',
          backgroundColor: COLORS['blue-standard'],
          borderColor: COLORS['blue-standard'],
          borderWidth: 1,
          yAxisID: 'y-axis-left',
          data: [
            0.2781569965870307,
            0.26384364820846906,
            0.16216216216216217,
            0.1388888888888889,
            0.16666666666666666,
          ],
        }],
      },

      options: {
        responsive: true,
        legend: {
          display: 'bottom',
        },
        tooltips: {
          mode: 'index',
          callbacks: {
            label(tooltipItems, data) {
              const { index } = tooltipItems;
              if (data.datasets[tooltipItems.datasetIndex].label === 'Reincarceration rate') {
                return `${data.datasets[tooltipItems.datasetIndex].label}: ${(data.datasets[tooltipItems.datasetIndex].data[index] * 100).toFixed(2)}%`;
              }
              return `${data.datasets[tooltipItems.datasetIndex].label}: ${(data.datasets[tooltipItems.datasetIndex].data[index])}`;
            },
          },
        },
        scaleShowValues: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
            position: 'left',
            id: 'y-axis-left',
            scaleLabel: {
              display: true,
              labelString: 'Reincarceration rate',
            },
          }],
          xAxes: [{
            ticks: {
              autoSkip: false,
            },
            scaleLabel: {
              display: true,
              labelString: 'Stay length (in months)',
            },
          }],
        },
      },
    });
  }

  const releaseVsAdmissionChartBox = document.getElementById('release-vs-admission-chart');

  if (releaseVsAdmissionChartBox) {
    const releaseVsAdmissionChartCtx = releaseVsAdmissionChartBox.getContext('2d');
    releaseVsAdmissionChartBox.height = 160;

    new Chart(releaseVsAdmissionChartCtx, {
      type: 'bar',
      data: {
        labels: ['November', 'December', 'January', 'February', 'March', 'April'],
        datasets: [{
          label: 'Admissions versus releases',
          backgroundColor: function(context) {
             if (context.dataset.data[context.dataIndex] > 0) {
                return COLORS_GOOD_BAD['bad'];
             } else {
                return COLORS_GOOD_BAD['good']; }
              },
          fill: false,
          borderWidth: 2,
          data: [3, -10, -11, -3, -1, 22],
        },
        ],
      },
      options: {
        legend: {
          display: false,
          position: 'right',
          labels: {
            usePointStyle: true,
            boxWidth: 20,
          },
        },
        tooltips: {
          mode: 'x',
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
              labelString: 'Counts',
            },
          }],
        },
      },
    });
  }

  // Functions for toggling of data on demographic recidivism exploration chart
  const recidivismExplorationChartBox = document.getElementById('recidivism-explore-chart');

  if (recidivismExplorationChartBox) {
    const recidivismExplorationChartCtx = recidivismExplorationChartBox.getContext('2d');
    recidivismExplorationChartBox.height = 160;

    const baselineRecidivismDataset = {
      label: 'Totals',
      borderColor: COLORS['grey-500'],
      pointBackgroundColor: COLORS['grey-700'],
      fill: false,
      borderDash: [10, 5],
      borderWidth: 2,
      data: [33, 10, 25, 27, 34, 31],
    };

    const recidivismExplorationChart = new Chart(recidivismExplorationChartCtx, {
      type: 'line',
      data: {
        labels: ['November', 'December', 'January', 'February', 'March', 'April'],
        datasets: [baselineRecidivismDataset],
      },

      options: {
        legend: {
          display: true,
          position: 'right',
          labels: {
            usePointStyle: true,
            boxWidth: 20,
          },
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
            scaleLabel: {
              display: true,
              labelString: 'Reincarceration count',
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
            value: 17,

            // optional annotation ID (must be unique)
            id: 'recidivism-exploration-goal-line',
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
      },
    });

    const enabledByRaceOption = {
      blackSubOption: false,
      hispanicSubOption: false,
      whiteSubOption: false,
    };

    const enabledByGenderOption = {
      femaleSubOption: false,
      maleSubOption: false,
    };

    const enabledBySentenceLengthOption = {
      '0-6 monthsSubOption': false,
      '7-12 monthsSubOption': false,
      '12-18 monthsSubOption': false,
      '18-24 monthsSubOption': false,
      '24+ monthsSubOption': false,
    };

    const flagsByDimension = {
      race: enabledByRaceOption,
      gender: enabledByGenderOption,
      sentenceLength: enabledBySentenceLengthOption,
    };

    const dimensions = ['race', 'gender', 'sentenceLength'];
    configureExplorationCheckboxes(
      flagsByDimension, dimensions, recidivismExplorationChart,
      'admission_count',
    );

    const recalibrateDatasetsForDate = function () {
      return recalibrateDatasetsForExplorationChart(
        flagsByDimension, dimensions,
        recidivismExplorationChart, 'admission_count',
      );
    };

    $('#startDateSelection').on('change', recalibrateDatasetsForDate);
    $('#endDateSelection').on('change', recalibrateDatasetsForDate);

    const exportedStructureCallback = function () {
      return {
        recidivismType: 'reincarceration',
        returnType: 'new_offenses',
        startDate: $('#startDateSelection').val(),
        endDate: $('#endDateSelection').val(),
        series: [],
      };
    };
    configureDownloadButtons(
      'recidivism', 'Exploration', recidivismExplorationChart,
      recidivismExplorationChartBox, exportedStructureCallback,
    );
  }

  // ------------------------------------------------------
  // Program Evaluation Module Charts =====================
  // ------------------------------------------------------

  const recidivismByProgramBarChartBox = document.getElementById('recidivism-by-program-bar-chart');

  if (recidivismByProgramBarChartBox) {
    const recidivismByProgramBarChartCtx = recidivismByProgramBarChartBox.getContext('2d');

    new Chart(recidivismByProgramBarChartCtx, {
      type: 'bar',
      data: {
        labels: ['Program A', 'Program B', 'Program C', 'Program D', 'Program E', 'Program F'],
        datasets: [{
          label: 'New offenses',
          backgroundColor: COLORS_STACKED_TWO_VALUES[0],
          borderColor: COLORS_STACKED_TWO_VALUES[0],
          borderWidth: 1,
          data: [30.3, 38.0, 36.3, 34.3, 30.6, 33.1],
        }, {
          label: 'Revocations',
          backgroundColor: COLORS_STACKED_TWO_VALUES[1],
          borderColor: COLORS_STACKED_TWO_VALUES[1],
          borderWidth: 1,
          data: [10.5, 13.5, 12.3, 11.6, 11.0, 12.8],
        }],
      },
      options: {
        responsive: true,
        legend: {
          position: 'top',
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          xAxes: [{
            ticks: {
              autoSkip: false,
            },
            stacked: true,
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Recidivism rate',
            },
            stacked: true,
          }],
        },
        annotation: {
          events: ['click'],
          annotations: [{
            type: 'line',
            mode: 'horizontal',
            value: 45,

            // optional annotation ID (must be unique)
            id: 'program-recidivism-baseline',
            scaleID: 'y-axis-0',

            drawTime: 'afterDatasetsDraw',

            borderColor: COLORS['grey-700'],
            borderWidth: 2,
            borderDash: [2, 2],
            borderDashOffset: 5,
            label: {
              enabled: false,
              content: 'State recidivism rate',
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
      },
    });
  }

  const programCostEffectivenessBarChartBox = document.getElementById('program-cost-effectiveness-bar-chart');

  if (programCostEffectivenessBarChartBox) {
    const programCostEffectivenessBarChartCtx = programCostEffectivenessBarChartBox.getContext('2d');

    new Chart(programCostEffectivenessBarChartCtx, {
      type: 'bar',
      data: {
        labels: ['Program A', 'Program B', 'Program C', 'Program D', 'Program E', 'Program F'],
        datasets: [{
          label: 'Incarceration costs reduced',
          backgroundColor: function(context) {
             if (context.dataset.data[context.dataIndex] < 0) {
                return COLORS_GOOD_BAD['bad'];
             } else {
                return COLORS_GOOD_BAD['good']; }
              },
          borderColor: COLORS['grey-300'],
          borderWidth: 1,
          data: [-123600, 704000, 554400, 378400, -122200, -432800],
        }],
      },
      options: {
        responsive: true,
        legend: {
          display: false,
          position: 'top',
        },
        tooltips: {
          mode: 'index',
          intersect: false,
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
              labelString: 'ROI per 100 people',
            },
          }],
        },
      },
    });
  }
}());
