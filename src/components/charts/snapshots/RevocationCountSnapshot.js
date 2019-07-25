import React, { useState, useEffect } from "react";

import { Line } from 'react-chartjs-2';
import { configureDownloadButtons } from "../../../assets/scripts/charts/chartJS/downloads";
import { COLORS, COLORS_THREE_VALUES } from "../../../assets/scripts/constants/colors";
import { useAuth0 } from "../../../react-auth0-spa";

const RevocationCountSnapshot = () => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);
  const { getTokenSilently } = useAuth0();

  const processResponse = (responseData) => {
    const countsByMonth = responseData.revocationCountsByMonth;

    var sortable = [];
    for (var month in countsByMonth) {
        sortable.push([month, countsByMonth[month]]);
    }

    return sortable;
  }

  const fetchChartData = async () => {
    try {
      const token = await getTokenSilently();
      // Likely needs to point to app engine URL
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/external`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const responseData = await response.json();
      const sorted = processResponse(responseData);

      setChartLabels(sorted.map(element => element[0]));
      setChartDataPoints(sorted.map(element => element[1]));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  const chart =
    <Line id='revocation-snapshot-chart'  data={{
      labels: ['November', 'December', 'January', 'February', 'March', 'April'],
      datasets: [{
        label: 'Total revocations',
        backgroundColor: COLORS['grey-300'],
        pointBackgroundColor: COLORS_THREE_VALUES[0],
        pointRadius: function(context) {
          if (context.dataIndex === context.dataset.data.length-1) {
            return 4;
          } else {
            return 0;
          }
        },
        hitRadius: 5,
        fill: false,
        borderWidth: 2,
        lineTension: 0,
        data: [40, 48, 60, 44, 54, 52],
      },{
        label: 'Technical revocations',
        backgroundColor: COLORS['grey-300'],
        pointBackgroundColor: COLORS_THREE_VALUES[1],
        pointRadius: function(context) {
          if (context.dataIndex === context.dataset.data.length-1) {
            return 4;
          } else {
            return 0;
          }
        },
        hitRadius: 5,
        fill: false,
        borderWidth: 2,
        lineTension: 0,
        data: [20, 28, 32, 24, 31, 32],
      },{
        label: 'Non-Technical revocations',
        backgroundColor: COLORS['grey-300'],
        pointBackgroundColor: COLORS_THREE_VALUES[2],
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
        data: [20, 20, 28, 20, 23, 20],
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
  configureDownloadButtons('revocation', 'Snapshot', chart.props,
    document.getElementById('revocation-snapshot-chart'), exportedStructureCallback
  );

  return (chart);
}

export default RevocationCountSnapshot;
