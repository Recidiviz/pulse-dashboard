import React, { useState, useEffect } from 'react';

import { Bar } from 'react-chartjs-2';
import { COLORS } from '../../../assets/scripts/constants/colors';
import { filterFacilities } from '../../../utils/dataOrganizing';

const ReincarcerationRateByReleaseFacility = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  const processResponse = () => {
    const { ratesByReleaseFacility: ratesByFacility } = props;

    let dataPoints = [];
    ratesByFacility.forEach((data) => {
      const { release_facility: facility, recidivism_rate: recidivismRate } = data;
      dataPoints.push([facility, recidivismRate])
    });

    dataPoints = filterFacilities(dataPoints, 'RELEASE', 'US_ND');

    // Sort by recidivism rate
    const sorted = dataPoints.sort((a, b) => (a[1] - b[1]));

    setChartLabels(sorted.map((element) => element[0]));
    setChartDataPoints(sorted.map((element) => element[1]));
  };

  useEffect(() => {
    processResponse();
  }, [props.ratesByReleaseFacility]);

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
};

export default ReincarcerationRateByReleaseFacility;
