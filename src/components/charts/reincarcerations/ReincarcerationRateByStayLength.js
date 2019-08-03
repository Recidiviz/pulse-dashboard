import React, { useState, useEffect } from "react";

import { Bar } from 'react-chartjs-2';
import { COLORS } from "../../../assets/scripts/constants/colors";

const ReincarcerationRateByStayLength = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  const processResponse = () => {
    const ratesByStayLength = props.ratesByStayLength;

    var sorted = [];
    for (var stayLength in ratesByStayLength) {
        sorted.push([stayLength, ratesByStayLength[stayLength]]);
    }
    sorted.sort(function(a, b) {
        return a[0] - b[0];
    });

    setChartLabels(sorted.map(element => element[0]));
    setChartDataPoints(sorted.map(element => element[1]));
  }

  useEffect(() => {
    processResponse();
  }, [props.ratesByStayLength]);

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
