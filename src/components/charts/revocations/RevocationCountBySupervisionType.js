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
import { COLORS_STACKED_TWO_VALUES } from '../../../assets/scripts/constants/colors';
import { monthNamesWithYearsFromNumbers } from '../../../utils/monthConversion';
import { sortAndFilterMostRecentMonths } from '../../../utils/dataOrganizing';

const RevocationCountBySupervisionType = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [paroleDataPoints, setParoleDataPoints] = useState([]);
  const [probationDataPoints, setProbationDataPoints] = useState([]);

  const processResponse = () => {
    const { revocationCountsByMonthBySupervisionType: countsByMonth } = props;

    const paroleData = [];
    const probationData = [];
    countsByMonth.forEach((data) => {
      const {
        year, month, parole_count: paroleCount, probation_count: probationCount,
      } = data;
      paroleData.push({ year, month, paroleCount });
      probationData.push({ year, month, probationCount });
    });

    const sortedParoleData = sortAndFilterMostRecentMonths(paroleData, 6);
    const sortedProbationData = sortAndFilterMostRecentMonths(probationData, 6);

    setChartLabels(monthNamesWithYearsFromNumbers(sortedParoleData.map(
      (element) => element.month,
    ), false));
    setParoleDataPoints(sortedParoleData.map((element) => element.paroleCount));
    setProbationDataPoints(sortedProbationData.map((element) => element.probationCount));
  };

  useEffect(() => {
    processResponse();
  }, [props.revocationCountsByMonthBySupervisionType]);

  return (
    <Bar
      data={{
        labels: chartLabels,
        datasets: [{
          label: 'Probation',
          type: 'bar',
          backgroundColor: COLORS_STACKED_TWO_VALUES[0],
          data: probationDataPoints,
        }, {
          label: 'Parole',
          type: 'bar',
          backgroundColor: COLORS_STACKED_TWO_VALUES[1],
          data: paroleDataPoints,
        },
        ],
      }}
      options={{
        responsive: true,
        legend: {
          position: 'bottom',
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Month',
            },
            stacked: true,
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Revocation count',
            },
            stacked: true,
          }],
        },
      }}
    />
  );
};

export default RevocationCountBySupervisionType;
