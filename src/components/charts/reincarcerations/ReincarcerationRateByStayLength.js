import React, { useState, useEffect } from 'react';

import { Bar } from 'react-chartjs-2';
import { COLORS } from '../../../assets/scripts/constants/colors';

const ReincarcerationRateByStayLength = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  const processResponse = () => {
    const { ratesByStayLength } = props;

    const stayLengthLabels = ['0-12', '12-24', '24-36', '36-48', '48-60',
      '60-72', '72-84', '84-96', '96-108', '108-120', '120+'];

    const ratesByStayLengthData = [];
    ratesByStayLength.forEach((data) => {
      let { stay_length_bucket: stayLength } = data;

      if (stayLength === '<12') {
        stayLength = '0-12';
      } else if (stayLength === '120<') {
        stayLength = '120+';
      }

      ratesByStayLengthData[stayLength] = data.recidivism_rate;
    });

    const rates = [];
    for (let i = 0; i < stayLengthLabels.length; i += 1) {
      rates.push(ratesByStayLengthData[stayLengthLabels[i]]);
    }

    setChartLabels(stayLengthLabels);
    setChartDataPoints(rates);
  };

  useEffect(() => {
    processResponse();
  }, [props.ratesByStayLength]);

  return (
    <Bar
      data={{
        labels: chartLabels,
        datasets: [{
          label: 'Reincarceration rate',
          backgroundColor: COLORS['blue-standard'],
          borderColor: COLORS['blue-standard'],
          borderWidth: 1,
          yAxisID: 'y-axis-left',
          data: chartDataPoints,
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
};

export default ReincarcerationRateByStayLength;
