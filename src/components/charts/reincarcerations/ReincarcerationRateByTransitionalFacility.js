import React, { useState, useEffect } from "react";

import { Bar } from 'react-chartjs-2';
import { COLORS } from "../../../assets/scripts/constants/colors";

const ReincarcerationRateByTransitionalFacility = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  const processResponse = () => {
    const ratesByFacility = props.ratesByTransitionalFacility;

    var sorted = [];
    for (var facility in ratesByFacility) {
        sorted.push([facility, ratesByFacility[facility]]);
    }
    // Sort the facilities in ascending order by rate
    sorted.sort(function(a, b) {
        return a[1] - b[1];
    });

    setChartLabels(sorted.map(element => element[0]));
    setChartDataPoints(sorted.map(element => element[1]));
  }

  useEffect(() => {
    processResponse();
  }, [props.ratesByTransitionalFacility]);

  return (
    <Bar data={{
      labels: chartLabels,
      datasets: [{
        label: 'Reincarceration rate',
        backgroundColor: COLORS['blue-standard-2'],
        borderColor: COLORS['blue-standard-2'],
        borderWidth: 1,
        yAxisID: 'y-axis-left',
        data: chartDataPoints
      }],
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
    }}
    />
  );
}

export default ReincarcerationRateByTransitionalFacility;
