import React, { useState, useEffect } from "react";

import { Bar } from 'react-chartjs-2';
import { COLORS } from "../../../assets/scripts/constants/colors";
import { useAuth0 } from "../../../react-auth0-spa";

const ReincarcerationRateByStayLength = () => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);
  const { getTokenSilently } = useAuth0();

  const processResponse = (responseData) => {
    const ratesByStayLength = responseData.ratesByStayLength;

    var sortable = [];
    for (var stayLength in ratesByStayLength) {
        sortable.push([stayLength, ratesByStayLength[stayLength]]);
    }
    sortable.sort(function(a, b) {
        return a[0] - b[0];
    });

    return sortable;
  }

  const fetchChartData = async () => {
    try {
      const token = await getTokenSilently();

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

  return (
    <Bar data={{
      labels: chartLabels,
      datasets: [{
        label: 'Reincarceration rate',
        backgroundColor: COLORS['blue-standard'],
        borderColor: COLORS['blue-standard'],
        borderWidth: 1,
        yAxisID: 'y-axis-left',
        data: chartDataPoints,
      }]
    }}
    options={{
      responsive: true,
      legend: {
        display: 'top',
      },
      tooltips: {
        mode: 'index',
        callbacks: {
          label(tooltipItems, data) {
            const { index } = tooltipItems;
            return `${data.datasets[tooltipItems.datasetIndex].label}: ${(data.datasets[tooltipItems.datasetIndex].data[index] * 100).toFixed(2)}%`;
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
    }}
    />
  );
}

export default ReincarcerationRateByStayLength;
