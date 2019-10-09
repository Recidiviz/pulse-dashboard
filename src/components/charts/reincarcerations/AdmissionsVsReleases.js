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
import { COLORS, COLORS_GOOD_BAD } from '../../../assets/scripts/constants/colors';
import { monthNamesWithYearsFromNumbers } from '../../../utils/monthConversion';
import { sortFilterAndSupplementMostRecentMonths } from '../../../utils/dataOrganizing';
import { configureDownloadButtons } from '../../../assets/scripts/utils/downloads';

const AdmissionsVsReleases = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);
  const [chartColors, setChartColors] = useState([]);

  const chartId = 'admissionsVsReleases';

  const processResponse = () => {
    const { admissionsVsReleases } = props;

    const dataPoints = [];
    if (admissionsVsReleases) {
      admissionsVsReleases.forEach((data) => {
        const { year, month, population_change: delta } = data;
        dataPoints.push({ year, month, delta });
      });
    }
    const sorted = sortFilterAndSupplementMostRecentMonths(dataPoints, 6, 'delta', 0);

    const colorsForValues = [];
    sorted.forEach((dataPoint) => {
      if (dataPoint.delta > 0) {
        colorsForValues.push([COLORS_GOOD_BAD.bad]);
      } else {
        colorsForValues.push([COLORS_GOOD_BAD.good]);
      }
    });

    setChartLabels(monthNamesWithYearsFromNumbers(sorted.map((element) => element.month), false));
    setChartDataPoints(sorted.map((element) => element.delta));
    setChartColors(colorsForValues);
  };

  useEffect(() => {
    processResponse();
  }, [props.admissionsVsReleases]);

  const chart = (
    <Bar
      id={chartId}
      data={{
        labels: chartLabels,
        datasets: [{
          label: 'Admissions versus releases',
          backgroundColor: chartColors,
          hoverBackgroundColor: chartColors,
          fill: false,
          data: chartDataPoints,
        }],
      }}
      options={{
        legend: {
          display: false,
          position: 'right',
          labels: {
            usePointStyle: true,
            boxWidth: 20,
          },
        },
        tooltips: {
          backgroundColor: COLORS['grey-800-light'],
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
              labelString: 'Admissions versus releases',
            },
          }],
        },
      }}
    />
  );

  const exportedStructureCallback = () => (
    {
      metric: 'Admissions versus releases',
      series: [],
    });

  configureDownloadButtons(chartId, chart.props.data.datasets,
    chart.props.data.labels, document.getElementById(chartId),
    exportedStructureCallback);

  const chartData = chart.props.data.datasets[0].data;
  const mostRecentValue = chartData[chartData.length - 1];

  const header = document.getElementById(props.header);

  if (header && (mostRecentValue !== null)) {
    let title = '';
    if (mostRecentValue === 0) {
      title = `The ND facilities <b style='color:#809AE5'> have not changed in size</b> this month.`;
    } else {
      const direction = (mostRecentValue > 0) ? 'grew' : 'shrank';
      title = `The ND facilities <b style='color:#809AE5'>${direction} by ${Math.abs(mostRecentValue)} people</b> this month.`;
    }

    header.innerHTML = title;
  }

  return chart;
};

export default AdmissionsVsReleases;
