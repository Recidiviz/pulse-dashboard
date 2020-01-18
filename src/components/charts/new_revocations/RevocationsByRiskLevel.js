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
import { toInt, humanReadableTitleCase } from '../../../utils/transforms/labels';

const RISK_LEVEL_TO_LABEL = {
  LOW: 'Low',
  MODERATE: 'Moderate',
  HIGH: 'High',
  VERY_HIGH: 'Very high',
};

const chartId = 'revocationsByRiskLevel';

const RevocationsByRiskLevel = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  const processResponse = () => {
    const riskLevelToCount = props.data.reduce(
      (result, { risk_level: riskLevel, population_count: populationCount }) => {
        return { ...result, [riskLevel]: (result[riskLevel] || 0) + (toInt(populationCount) || 0) };
      }, {},
    );

    const labels = Object.values(RISK_LEVEL_TO_LABEL);
    const displayLabels = labels.map((label) => humanReadableTitleCase(label));
    const dataPoints = Object.keys(RISK_LEVEL_TO_LABEL).map((riskLevel) => riskLevelToCount[riskLevel])
    setChartLabels(displayLabels);
    setChartDataPoints(dataPoints);
  }

  useEffect(() => {
    processResponse();
  }, [props.data]);

  const chart = (
    <Bar
      id={chartId}
      data={{
        labels: chartLabels,
        datasets: [{
          label: 'Revocations',
          backgroundColor: COLORS['orange-500'],
          hoverBackgroundColor: COLORS['orange-500'],
          hoverBorderColor: COLORS['orange-500'],
          data: chartDataPoints,
        }],
      }}
      options={{
        legend: {
          display: false,
        },
        responsive: true,
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Risk level',
            },
            stacked: true,
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: '# of revocations',
            },
            stacked: true,
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
        Revocations by risk level
        <ExportMenu
          chartId={chartId}
          chart={chart}
          metricTitle="Revocations by risk level"
        />
      </h4>

      {chart}
    </div>
  );
};

export default RevocationsByRiskLevel;
