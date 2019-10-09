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

import { Pie } from 'react-chartjs-2';
import { COLORS, COLORS_FIVE_VALUES } from '../../../assets/scripts/constants/colors';
import { sortByLabel } from '../../../utils/dataOrganizing';
import { configureDownloadButtons } from '../../../assets/scripts/utils/downloads';
import { toInt } from '../../../utils/variableConversion';

const AdmissionTypeProportions = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  const chartId = 'admissionTypeProportions';

  const processResponse = () => {
    const { admissionCountsByType } = props;

    const labelStringConversion = {
      UNKNOWN_REVOCATION: 'Revocations (Unknown Type)',
      NEW_ADMISSION: 'New Admissions',
      NON_TECHNICAL: 'Non-Technical Revocations',
      TECHNICAL: 'Technical Revocations',
    };

    const dataPoints = [];
    if (admissionCountsByType) {
      admissionCountsByType.forEach((data) => {
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

  useEffect(() => {
    processResponse();
  }, [props.admissionCountsByType]);

  const chart = (
    <Pie
      id={chartId}
      data={{
        datasets: [{
          data: chartDataPoints,
          // Note: these colors are intentionally set in this order so that
          // the colors for technical and unknown revocations match those of
          // the other charts on this page
          backgroundColor: [
            COLORS_FIVE_VALUES[1],
            COLORS_FIVE_VALUES[0],
            COLORS_FIVE_VALUES[3],
            COLORS_FIVE_VALUES[2],
          ],
          hoverBackgroundColor: [
            COLORS_FIVE_VALUES[1],
            COLORS_FIVE_VALUES[0],
            COLORS_FIVE_VALUES[3],
            COLORS_FIVE_VALUES[2],
          ],
          hoverBorderColor: [
            COLORS_FIVE_VALUES[1],
            COLORS_FIVE_VALUES[0],
            COLORS_FIVE_VALUES[3],
            COLORS_FIVE_VALUES[2],
          ],
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

  const exportedStructureCallback = () => (
    {
      metric: 'Admissions by type',
      series: [],
    });

  configureDownloadButtons(chartId, chart.props.data.datasets,
    chart.props.data.labels, document.getElementById(chartId),
    exportedStructureCallback);

  return chart;
};

export default AdmissionTypeProportions;
