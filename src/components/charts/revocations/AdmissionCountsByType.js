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
import { Bar, Pie } from 'react-chartjs-2';

import { COLORS, COLORS_FIVE_VALUES } from '../../../assets/scripts/constants/colors';
import { configureDownloadButtons } from '../../../assets/scripts/utils/downloads';
import {
  filterDatasetByDistrict, filterDatasetByTimeWindow,
} from '../../../utils/charts/toggles';
import { sortByLabel } from '../../../utils/transforms/datasets';
import { toInt } from '../../../utils/transforms/labels';

const AdmissionCountsByType = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  const chartId = 'admissionCountsByType';

  const labelStringConversion = {
    UNKNOWN_REVOCATION: 'Revocations (Unknown Type)',
    NEW_ADMISSION: 'New Admissions',
    NON_TECHNICAL: 'Non-Technical Revocations',
    TECHNICAL: 'Technical Revocations',
  };

  const processResponse = () => {
    const { admissionCountsByType } = props;

    let filteredAdmissionCounts = filterDatasetByDistrict(
      admissionCountsByType, props.district,
    );

    filteredAdmissionCounts = filterDatasetByTimeWindow(
      filteredAdmissionCounts, props.timeWindow,
    );

    const dataPoints = [];
    if (filteredAdmissionCounts) {
      filteredAdmissionCounts.forEach((data) => {
        const { admission_type: admissionType } = data;
        const count = toInt(data.admission_count);
        dataPoints.push({ type: labelStringConversion[admissionType], count });
      });
    } else {
      Object.values(labelStringConversion).forEach((type) => {
        dataPoints.push({ type, count: 0 });
      });
    }

    const sorted = sortByLabel(dataPoints, 'type');

    setChartLabels(sorted.map((element) => element.type));
    setChartDataPoints(sorted.map((element) => element.count));
  };

  const chartColors = [
    COLORS_FIVE_VALUES[1],
    COLORS_FIVE_VALUES[0],
    COLORS_FIVE_VALUES[3],
    COLORS_FIVE_VALUES[2],
  ];

  const ratesChart = (
    <Pie
      id={chartId}
      data={{
        datasets: [{
          label: 'Admission count',
          data: chartDataPoints,
          // Note: these colors are intentionally set in this order so that
          // the colors for technical and unknown revocations match those of
          // the other charts on this page
          backgroundColor: chartColors,
          hoverBackgroundColor: chartColors,
          hoverBorderColor: chartColors,
          hoverBorderWidth: 0.5,
        }],
        labels: chartLabels,
      }}
      options={{
        responsive: true,
        legend: {
          position: 'right',
        },
        tooltips: {
          backgroundColor: COLORS['grey-800-light'],
          callbacks: {
            label: (tooltipItem, data) => {
              const dataset = data.datasets[tooltipItem.datasetIndex];

              const total = dataset.data.reduce(
                (previousValue, currentValue) => (previousValue + currentValue),
              );

              const currentValue = dataset.data[tooltipItem.index];
              const percentage = ((currentValue / total) * 100).toFixed(2);

              return (data.labels[tooltipItem.index]).concat(': ', percentage, '% (', currentValue, ')');
            },
          },
        },
      }}
    />
  );

  const countsChart = (
    <Bar
      id={chartId}
      data={{
        labels: ['Admission Counts'],
        datasets: [{
          label: chartLabels[0],
          backgroundColor: chartColors[0],
          hoverBackgroundColor: chartColors[0],
          hoverBorderColor: chartColors[0],
          data: [
            chartDataPoints[0],
          ],
        }, {
          label: chartLabels[1],
          backgroundColor: chartColors[1],
          hoverBackgroundColor: chartColors[1],
          hoverBorderColor: chartColors[1],
          data: [
            chartDataPoints[1],
          ],
        }, {
          label: chartLabels[2],
          backgroundColor: chartColors[2],
          hoverBackgroundColor: chartColors[2],
          hoverBorderColor: chartColors[2],
          data: [
            chartDataPoints[2],
          ],
        }, {
          label: chartLabels[3],
          backgroundColor: chartColors[3],
          hoverBackgroundColor: chartColors[3],
          hoverBorderColor: chartColors[3],
          data: [
            chartDataPoints[3],
          ],
        }],
      }}
      options={{
        responsive: true,
        legend: {
          position: 'right',
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
              labelString: 'Admission counts',
            },
          }],
        },
      }}
    />
  );

  let activeChart = countsChart;
  if (props.metricType === 'rates') {
    activeChart = ratesChart;
  }

  const exportedStructureCallback = () => (
    {
      metric: 'Admissions by type',
      series: [],
    });

  configureDownloadButtons(chartId, 'ADMISSIONS BY TYPE', activeChart.props.data.datasets,
    activeChart.props.data.labels, document.getElementById(chartId),
    exportedStructureCallback, props);

  useEffect(() => {
    processResponse();
  }, [
    props.admissionCountsByType,
    props.metricType,
    props.timeWindow,
    props.district,
  ]);

  return activeChart;
};

export default AdmissionCountsByType;
