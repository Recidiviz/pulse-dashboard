// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2019 Recidiviz, Inc.
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

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

import { COLORS } from '../../../assets/scripts/constants/colors';
import { configureDownloadButtons } from '../../../assets/scripts/utils/downloads';

const ReincarcerationRateByStayLength = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  const chartId = 'reincarcerationRateByStayLength';

  const processResponse = () => {
    const { ratesByStayLength } = props;

    const stayLengthLabels = ['0-12', '12-24', '24-36', '36-48', '48-60',
      '60-72', '72-84', '84-96', '96-108', '108-120', '120+'];

    const ratesByStayLengthData = [];
    if (ratesByStayLength) {
      ratesByStayLength.forEach((data) => {
        let { stay_length_bucket: stayLength } = data;

        if (stayLength === '<12') {
          stayLength = '0-12';
        } else if (stayLength === '120<') {
          stayLength = '120+';
        }

        ratesByStayLengthData[stayLength] = data.recidivism_rate;
      });
    }

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

  const chart = (
    <Bar
      id={chartId}
      data={{
        labels: chartLabels,
        datasets: [{
          label: 'Reincarceration rate',
          backgroundColor: COLORS['blue-standard'],
          hoverBackgroundColor: COLORS['blue-standard'],
          yAxisID: 'y-axis-left',
          data: chartDataPoints,
        }],
      }}
      options={{
        responsive: true,
        legend: {
          display: false,
        },
        tooltips: {
          backgroundColor: COLORS['grey-800-light'],
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

  const exportedStructureCallback = () => (
    {
      metric: 'Reincarceration rate by previous stay length',
      series: [],
    });

  configureDownloadButtons(chartId, 'REINCARCERATION RATE BY PREVIOUS STAY LENGTH',
    chart.props.data.datasets, chart.props.data.labels,
    document.getElementById(chartId), exportedStructureCallback);

  return chart;
};

export default ReincarcerationRateByStayLength;
