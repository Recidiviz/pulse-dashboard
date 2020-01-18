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
import { toInt } from '../../../utils/transforms/labels';

const CHART_LABELS = ['Overall', 'Low Risk', 'Moderate Risk', 'High Risk', 'Very High Risk'];
const RISK_LEVELS = ['LOW', 'MODERATE', 'HIGH', 'VERY_HIGH'];
const RACES = ['WHITE', 'BLACK', 'HISPANIC', 'ASIAN', 'NATIVE_AMERICAN', 'PACIFIC_ISLANDER'];

const chartId = 'revocationsByRace';

const RevocationsByRace = (props) => {
  const [chartDataPoints, setChartDataPoints] = useState([]);

  const getRiskLevelArrayForRace = (forRace) => RISK_LEVELS.map((riskLevel) => (
    props.data
      .filter(({ race, risk_level: dataRiskLevel }) => race === forRace && dataRiskLevel === riskLevel)
      .reduce((result, { population_count: populationCount }) => result += toInt(populationCount), 0)
  ));

  const processResponse = () => {
    const raceToCount = props.data.reduce(
      (result, { race, population_count: populationCount }) => {
        return { ...result, [race]: (result[race] || 0) + (toInt(populationCount) || 0) };
      }, {},
    );

    const dataPoints = RACES.map((race) => [raceToCount[race], ...getRiskLevelArrayForRace(race)]);
    setChartDataPoints(dataPoints);
  };

  useEffect(() => {
    processResponse();
  }, [props.data]);

  const chart = (
    <Bar
      id={chartId}
      data={{
        labels: CHART_LABELS,
        datasets: [{
          label: 'Caucasian',
          backgroundColor: COLORS['light-blue-600'],
          hoverBackgroundColor: COLORS['light-blue-600'],
          hoverBorderColor: COLORS['light-blue-600'],
          data: chartDataPoints[0],
        }, {
          label: 'African American',
          backgroundColor: COLORS['light-blue-500'],
          hoverBackgroundColor: COLORS['light-blue-500'],
          hoverBorderColor: COLORS['light-blue-500'],
          data: chartDataPoints[1],
        }, {
          label: 'Hispanic',
          backgroundColor: COLORS['light-blue-400'],
          hoverBackgroundColor: COLORS['light-blue-400'],
          hoverBorderColor: COLORS['light-blue-400'],
          data: chartDataPoints[2],
        }, {
          label: 'Asian',
          backgroundColor: COLORS['light-blue-300'],
          hoverBackgroundColor: COLORS['light-blue-300'],
          hoverBorderColor: COLORS['light-blue-300'],
          data: chartDataPoints[3],
        }, {
          label: 'Native American',
          backgroundColor: COLORS['light-blue-200'],
          hoverBackgroundColor: COLORS['light-blue-200'],
          hoverBorderColor: COLORS['light-blue-200'],
          data: chartDataPoints[4],
        }, {
          label: 'Pacific Islander',
          backgroundColor: COLORS['light-blue-100'],
          hoverBackgroundColor: COLORS['light-blue-100'],
          hoverBorderColor: COLORS['light-blue-100'],
          data: chartDataPoints[5],
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
              labelString: 'Race',
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
        Revocations by race
        <ExportMenu
          chartId={chartId}
          chart={chart}
          metricTitle="Revocations by race"
        />
      </h4>

      {chart}
    </div>
  );
};

export default RevocationsByRace;
