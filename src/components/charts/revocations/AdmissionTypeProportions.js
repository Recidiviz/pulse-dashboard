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
import { COLORS_FIVE_VALUES } from '../../../assets/scripts/constants/colors';
import { sortByLabel } from '../../../utils/dataOrganizing';

const AdmissionTypeProportions = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  const processResponse = () => {
    const { admissionCountsByType } = props;

    const labelStringConversion = {
      UNKNOWN_REVOCATION: 'Revocations (Unknown Type)',
      NEW_ADMISSION: 'New Admissions',
      NON_TECHNICAL: 'Non-Technical Revocations',
      TECHNICAL: 'Technical Revocations',
    };

    const dataPoints = [];
    admissionCountsByType.forEach((data) => {
      const { admission_type: admissionType } = data;
      const count = parseInt(data.admission_count, 10);
      dataPoints.push({ type: labelStringConversion[admissionType], count });
    });

    const sorted = sortByLabel(dataPoints, 'type');

    setChartLabels(sorted.map((element) => element.type));
    setChartDataPoints(sorted.map((element) => element.count));
  };

  useEffect(() => {
    processResponse();
  }, [props.admissionCountsByType]);

  return (
    <Pie
      data={{
        datasets: [{
          data: chartDataPoints,
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
        }],
        labels: chartLabels,
      }}
      options={{
        responsive: true,
        legend: {
          position: 'right',
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const dataset = data.datasets[tooltipItem.datasetIndex];

              const total = dataset.data.reduce(
                (previousValue, currentValue) => (previousValue + currentValue),
              );

              const currentValue = dataset.data[tooltipItem.index];
              const percentage = ((currentValue / total) * 100).toFixed(2);

              return (data.labels[tooltipItem.index]).concat(': ', currentValue, ' (', percentage, '%)');
            },
          },
        },
      }}
    />
  );
};

export default AdmissionTypeProportions;
