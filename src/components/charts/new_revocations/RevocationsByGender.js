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
  getTrailingLabelFromMetricPeriodMonthsToggle, getPeriodLabelFromMetricPeriodMonthsToggle,
  tooltipForRateMetricWithNestedCounts,
} from '../../../utils/charts/toggles';
import { toInt } from '../../../utils/transforms/labels';

const CHART_LABELS = ['Overall', 'Low Risk', 'Moderate Risk', 'High Risk', 'Very High Risk'];
const RISK_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'];
const GENDERS = ['FEMALE', 'MALE'];

const chartId = 'revocationsByGender';

const RevocationsByGender = (props) => {
  const [chartDataPoints, setChartDataPoints] = useState([]);
  const [numeratorCounts, setNumeratorCounts] = useState([]);
  const [denominatorCounts, setDenominatorCounts] = useState([]);

  const getRevocationsForRiskLevel = (forGender) => RISK_LEVELS.map((riskLevel) => (
    props.data
      .filter(({ gender, risk_level: dataRiskLevel }) => gender === forGender && dataRiskLevel === riskLevel)
      .reduce((result, { population_count: populationCount }) => result += toInt(populationCount), 0)
  ));

  const getSupervisionCountsForRiskLevel = (forGender) => RISK_LEVELS.map((riskLevel) => (
    props.data
      .filter(({ gender, risk_level: dataRiskLevel }) => gender === forGender && dataRiskLevel === riskLevel)
      .reduce((result, { total_supervision_count: totalSupervisionCount }) => result += toInt(totalSupervisionCount), 0)
  ));

  const getRate = (revocations, supervisionCount) => {
    if (!revocations || !supervisionCount) {
      return '0.00';
    }

    return (100 * (revocations / supervisionCount)).toFixed(2);
  };

  const processResponse = () => {
    const revocationsByGender = props.data.reduce(
      (result, { gender, population_count: populationCount }) => {
        return { ...result, [gender]: (result[gender] || 0) + (toInt(populationCount) || 0) };
      }, {},
    );

    const supervisionCountsByGender = props.data.reduce(
      (result, { gender, total_supervision_count: totalSupervisionCount }) => {
        return { ...result, [gender]: (result[gender] || 0) + (toInt(totalSupervisionCount) || 0) };
      }, {},
    );

    const revocations = GENDERS.map((gender) => [revocationsByGender[gender], ...getRevocationsForRiskLevel(gender)]);
    const supervisionCounts = GENDERS.map((gender) => [supervisionCountsByGender[gender], ...getSupervisionCountsForRiskLevel(gender)]);

    const dataPoints = [];
    for (let i = 0; i < revocations.length; i += 1) {
      dataPoints.push([]);
      for (let j = 0; j < revocations[i].length; j += 1) {
        const rate = getRate(revocations[i][j], supervisionCounts[i][j]);
        dataPoints[i].push(rate);
      }
    }

    setChartDataPoints(dataPoints);
    setNumeratorCounts(revocations);
    setDenominatorCounts(supervisionCounts);
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
        labels: CHART_LABELS,
        datasets: [{
          label: 'Women',
          backgroundColor: COLORS['light-blue-500'],
          hoverBackgroundColor: COLORS['light-blue-500'],
          hoverBorderColor: COLORS['light-blue-500'],
          data: chartDataPoints[0],
        }, {
          label: 'Men',
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
              labelString: 'Gender and risk level',
            },
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
            scaleLabel: {
              display: true,
              labelString: 'Revocation rate',
            },
          }],
        },
        tooltips: {
          backgroundColor: COLORS['grey-800-light'],
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (tooltipItem, data) => tooltipForRateMetricWithNestedCounts(tooltipItem, data, numeratorCounts, denominatorCounts),
          },
        },
      }}
    />
  );

  return (
    <div>
      <h4>
        Revocation rates by gender and risk level
        <ExportMenu
          chartId={chartId}
          chart={chart}
          metricTitle="Revocation rates by gender and risk level"
        />
      </h4>
      <h6 className="pB-20">
        {`${getTrailingLabelFromMetricPeriodMonthsToggle(props.metricPeriodMonths)} (${getPeriodLabelFromMetricPeriodMonthsToggle(props.metricPeriodMonths)})`}
      </h6>

      {chart}
    </div>
  );
};

export default RevocationsByGender;
