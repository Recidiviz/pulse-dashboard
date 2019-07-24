import React, { useState, useEffect } from "react";

import { Bar } from 'react-chartjs-2';
import { COLORS, COLORS_STACKED_TWO_VALUES } from "../../../assets/scripts/constants/colors";
import { useAuth0 } from "../../../react-auth0-spa";

const RecidivismRateByProgram = () => {
  const [chartLabels, setChartLabels] = useState([]);
  const [newOffensesDataPoints, setNewOffensesDataPoints] = useState([]);
  const [revocationDataPoints, setRevocationDataPoints] = useState([]);
  const { getTokenSilently } = useAuth0();

  const processResponse = (responseData) => {
    const rateByProgram = responseData.recidivismRateByProgram;

    var byProgram = [];
    for (var program in rateByProgram) {
        byProgram.push([program, rateByProgram[program]]);
    }

    return byProgram;
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
      setNewOffensesDataPoints(sorted.map(element => element[1].newOffenses));
      setRevocationDataPoints(sorted.map(element => element[1].revocations));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  return (
    <Bar data={{
      labels: chartLabels,
      datasets: [{
        label: 'New offenses',
        backgroundColor: COLORS_STACKED_TWO_VALUES[0],
        borderColor: COLORS_STACKED_TWO_VALUES[0],
        borderWidth: 1,
        data: newOffensesDataPoints,
      }, {
        label: 'Revocations',
        backgroundColor: COLORS_STACKED_TWO_VALUES[1],
        borderColor: COLORS_STACKED_TWO_VALUES[1],
        borderWidth: 1,
        data: revocationDataPoints,
      }],
    }}
    options={{
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
    }}
    />
  );
}

export default RecidivismRateByProgram;
