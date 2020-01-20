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
import ExportMenu from '../ExportMenu';

import { COLORS } from '../../../assets/scripts/constants/colors';
import { configureDownloadButtons } from '../../../assets/scripts/utils/downloads';
import { toInt } from '../../../utils/transforms/labels';

const CHART_LABELS = ['Overall', 'Low Risk', 'Moderate Risk', 'High Risk', 'Very High Risk'];
const RISK_LEVELS = ['LOW', 'MODERATE', 'HIGH', 'VERY_HIGH'];
const GENDERS = ['FEMALE', 'MALE'];

const chartId = 'revocationsByGender';

const RevocationsByGender = (props) => {
  const [chartDataPoints, setChartDataPoints] = useState([]);

  const getRiskLevelArrayForGender = (forGender) => RISK_LEVELS.map((riskLevel) => (
    props.data
      .filter(({ gender, risk_level: dataRiskLevel }) => gender === forGender && dataRiskLevel === riskLevel)
      .reduce((result, { population_count: populationCount }) => result += toInt(populationCount), 0)
  ));

  const processResponse = () => {
    const genderToCount = props.data.reduce(
      (result, { gender, population_count: populationCount }) => {
        return { ...result, [gender]: (result[gender] || 0) + (toInt(populationCount) || 0) };
      }, {},
    );

    const dataPoints = GENDERS.map((gender) => [genderToCount[gender], ...getRiskLevelArrayForGender(gender)]);
    setChartDataPoints(dataPoints);
  }

  useEffect(() => {
    processResponse();
  }, [props.data]);

  const chart = (
    <Bar
      id={chartId}
      data={{
        labels: CHART_LABELS,
        datasets: [{
          label: 'Female',
          backgroundColor: COLORS['light-blue-500'],
          hoverBackgroundColor: COLORS['light-blue-500'],
          hoverBorderColor: COLORS['light-blue-500'],
          data: chartDataPoints[0],
        }, {
          label: 'Male',
          backgroundColor: COLORS['orange-500'],
          hoverBackgroundColor: COLORS['orange-500'],
          hoverBorderColor: COLORS['orange-500'],
          data: chartDataPoints[1],
        }],
      }}
      options={{
        legend: {
          position: 'bottom',
        },
        responsive: true,
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Gender',
            },
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: '# of revocations',
            },
            ticks: {
              beginAtZero: true,
            },
          }],
        },
        tooltips: {
          backgroundColor: COLORS['grey-800-light'],
          mode: 'index',
          intersect: false,
        },
      }}
    />
  );

  return (
    <div>
      <h4 className="pB-20">
        Revocations by gender
        <ExportMenu
          chartId={chartId}
          chart={chart}
          metricTitle="Revocations by gender"
        />
      </h4>

      {chart}
    </div>
  );
};

export default RevocationsByGender;
