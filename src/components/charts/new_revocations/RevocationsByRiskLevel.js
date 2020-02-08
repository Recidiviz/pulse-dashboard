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
import {
  getTrailingLabelFromMetricPeriodMonthsToggle, standardTooltipForRateMetric,
} from '../../../utils/charts/toggles';
import {
  toInt, humanReadableTitleCase, riskLevelValuetoLabel,
} from '../../../utils/transforms/labels';

const chartId = 'revocationsByRiskLevel';

const RevocationsByRiskLevel = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  const processResponse = () => {
    const revocationsByRiskLevel = props.data.reduce(
      (result, { risk_level: riskLevel, population_count: populationCount }) => {
        return { ...result, [riskLevel]: (result[riskLevel] || 0) + (toInt(populationCount) || 0) };
      }, {},
    );

    const supervisionCountsByRiskLevel = props.data.reduce(
      (result, { risk_level: riskLevel, total_supervision_count: totalSupervisionCount }) => {
        return { ...result, [riskLevel]: (result[riskLevel] || 0) + (toInt(totalSupervisionCount) || 0) };
      }, {},
    );

    const getRate = (riskLevel) => {
      const revocations = revocationsByRiskLevel[riskLevel];
      const supervisionCount = supervisionCountsByRiskLevel[riskLevel];

      if (!revocations || !supervisionCount) {
        return '0.00';
      }

      return (100 * (revocations / supervisionCount)).toFixed(2);
    };

    const labels = Object.values(riskLevelValuetoLabel);
    const displayLabels = labels.map((label) => humanReadableTitleCase(label));
    const dataPoints = Object.keys(riskLevelValuetoLabel).map((riskLevel) => getRate(riskLevel));
    setChartLabels(displayLabels);
    setChartDataPoints(dataPoints);
  };

  useEffect(() => {
    processResponse();
  }, [
    props.data,
    props.metricPeriodMonths,
  ]);

  const chart = (
    <Bar
      id={chartId}
      data={{
        labels: chartLabels,
        datasets: [{
          label: 'Revocation rate',
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
            ticks: {
              beginAtZero: true,
            },
            scaleLabel: {
              display: true,
              labelString: 'revocation rate',
            },
            stacked: true,
          }],
        },
        tooltips: {
          backgroundColor: COLORS['grey-800-light'],
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (tooltipItem, data) => standardTooltipForRateMetric(tooltipItem, data),
          },
        },
      }}
    />
  );

  return (
    <div>
      <h4>
        Revocations by risk level
        <ExportMenu
          chartId={chartId}
          chart={chart}
          metricTitle="Revocations by risk level"
        />
      </h4>
      <h6 className="pB-20">
        {getTrailingLabelFromMetricPeriodMonthsToggle(props.metricPeriodMonths)}
      </h6>

      {chart}
    </div>
  );
};

export default RevocationsByRiskLevel;
