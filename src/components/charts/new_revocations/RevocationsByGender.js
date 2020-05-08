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

import DataSignificanceWarningIcon from '../DataSignificanceWarningIcon';
import ExportMenu from '../ExportMenu';
import Loading from '../../Loading';

import { useAuth0 } from '../../../react-auth0-spa';
import { fetchChartData, awaitingResults } from '../../../utils/metricsClient';

import { COLORS } from '../../../assets/scripts/constants/colors';
import { axisCallbackForPercentage } from '../../../utils/charts/axis';
import {
  generateLabelsWithCustomColors,
  getBarBackgroundColor,
  isDenominatorsMatrixStatisticallySignificant,
  tooltipForFooterWithNestedCounts,
} from '../../../utils/charts/significantStatistics';
import {
  getTrailingLabelFromMetricPeriodMonthsToggle,
  getPeriodLabelFromMetricPeriodMonthsToggle,
  tooltipForRateMetricWithNestedCounts,
} from '../../../utils/charts/toggles';
import { toInt } from '../../../utils/transforms/labels';

const CHART_LABELS = ['Overall', 'Not Assessed', 'Low Risk', 'Moderate Risk', 'High Risk', 'Very High Risk'];
const RISK_LEVELS = ['NOT_ASSESSED', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'];
const GENDERS = ['FEMALE', 'MALE'];

const chartId = 'revocationsByGender';

const RevocationsByGender = (props) => {
  const [chartDataPoints, setChartDataPoints] = useState([]);
  const [numeratorCounts, setNumeratorCounts] = useState([]);
  const [denominatorCounts, setDenominatorCounts] = useState([]);

  const { loading, user, getTokenSilently } = useAuth0();
  const [apiData, setApiData] = useState({});
  const [awaitingApi, setAwaitingApi] = useState(true);

  const showWarning = !isDenominatorsMatrixStatisticallySignificant(denominatorCounts);

  const getRevocationsForRiskLevel = (forGender, filteredData) => RISK_LEVELS.map((riskLevel) => (
    filteredData
      .filter(({ gender, risk_level: dataRiskLevel }) => gender === forGender && dataRiskLevel === riskLevel)
      .reduce((result, { population_count: populationCount }) => result += toInt(populationCount), 0)
  ));

  const getSupervisionCountsForRiskLevel = (forGender, filteredData) => RISK_LEVELS.map((riskLevel) => (
    filteredData
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
    if (awaitingApi || !apiData) {
      return;
    }
    const filteredData = props.dataFilter(
      apiData, props.skippedFilters, props.treatCategoryAllAsAbsent,
    );

    const revocationsByGender = filteredData.reduce(
      (result, { gender, population_count: populationCount }) => {
        return { ...result, [gender]: (result[gender] || 0) + (toInt(populationCount) || 0) };
      }, {},
    );

    const supervisionCountsByGender = filteredData.reduce(
      (result, { gender, total_supervision_count: totalSupervisionCount }) => {
        return { ...result, [gender]: (result[gender] || 0) + (toInt(totalSupervisionCount) || 0) };
      }, {},
    );

    const revocations = GENDERS.map((gender) => [revocationsByGender[gender], ...getRevocationsForRiskLevel(gender, filteredData)]);
    const supervisionCounts = GENDERS.map((gender) => [supervisionCountsByGender[gender], ...getSupervisionCountsForRiskLevel(gender, filteredData)]);

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
    fetchChartData(
      'us_mo', 'newRevocations', 'revocations_matrix_distribution_by_gender',
      setApiData, setAwaitingApi, getTokenSilently,
    );
  }, []);

  useEffect(() => {
    processResponse();
  }, [
    apiData,
    awaitingApi,
    props.filterStates,
    props.metricPeriodMonths,
  ]);

  const colors = [
    COLORS['lantern-light-blue'],
    COLORS['lantern-orange'],
  ]

  const generateDataset = (label, index) => ({
    label: label,
    backgroundColor: getBarBackgroundColor(colors[index], denominatorCounts),
    data: chartDataPoints[index],
  });

  const chart = (
    <Bar
      id={chartId}
      data={{
        labels: CHART_LABELS,
        datasets: [
          generateDataset('Women', 0),
          generateDataset('Men', 1),
        ],
      }}
      options={{
        legend: {
          position: 'bottom',
          labels: {
            generateLabels: (chart) => generateLabelsWithCustomColors(chart, colors)
          }
        },
        responsive: true,
        maintainAspectRatio: false,
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
              callback: axisCallbackForPercentage(),
            },
            scaleLabel: {
              display: true,
              labelString: 'Percent revoked',
            },
          }],
        },
        tooltips: {
          backgroundColor: COLORS['grey-800-light'],
          footerFontSize: 9,
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (tooltipItem, data) => tooltipForRateMetricWithNestedCounts(tooltipItem, data, numeratorCounts, denominatorCounts),
            footer: (tooltipItem) => tooltipForFooterWithNestedCounts(tooltipItem, denominatorCounts),
          },
        },
      }}
    />
  );

  if (awaitingResults(loading, user, awaitingApi)) {
    return <Loading />;
  }

  return (
    <div>
      <h4>
        Percent revoked by gender and risk level
        {showWarning === true && <DataSignificanceWarningIcon />}
        <ExportMenu
          chartId={chartId}
          chart={chart}
          metricTitle="Percent revoked by gender and risk level"
          timeWindowDescription={`${getTrailingLabelFromMetricPeriodMonthsToggle(props.metricPeriodMonths)} (${getPeriodLabelFromMetricPeriodMonthsToggle(props.metricPeriodMonths)})`}
          filters={props.filterStates}
        />
      </h4>
      <h6 className="pB-20">
        {`${getTrailingLabelFromMetricPeriodMonthsToggle(props.metricPeriodMonths)} (${getPeriodLabelFromMetricPeriodMonthsToggle(props.metricPeriodMonths)})`}
      </h6>

      <div className="static-chart-container fs-block">
        {chart}
      </div>
    </div>
  );
};

export default RevocationsByGender;
