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
import { Bar, Line } from 'react-chartjs-2';
import ExportMenu from '../ExportMenu';
import Loading from '../../Loading';

import { useAuth0 } from '../../../react-auth0-spa';
import { fetchChartData, awaitingResults } from '../../../utils/metricsClient';

import { COLORS } from '../../../assets/scripts/constants/colors';
import { labelCurrentMonth, currentMonthBox } from '../../../utils/charts/currentSpan';
import {
  getMonthCountFromMetricPeriodMonthsToggle, getTrailingLabelFromMetricPeriodMonthsToggle,
  centerSingleMonthDatasetIfNecessary,
} from '../../../utils/charts/toggles';
import { sortFilterAndSupplementMostRecentMonths } from '../../../utils/transforms/datasets';
import { toInt } from '../../../utils/transforms/labels';
import { monthNamesAllWithYearsFromNumbers } from '../../../utils/transforms/months';

const chartId = 'revocationsOverTime';

const RevocationsOverTime = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  const { loading, user, getTokenSilently } = useAuth0();
  const [apiData, setApiData] = useState({});
  const [awaitingApi, setAwaitingApi] = useState(true);

  const processResponse = () => {
    if (awaitingApi || !apiData) {
      return;
    }
    const filteredData = props.dataFilter(
      apiData, props.skippedFilters, props.treatCategoryAllAsAbsent,
    );

    const yearAndMonthToCount = filteredData.reduce(
      (result, { year, month, total_revocations: totalRevocations }) => {
        return { ...result, [`${year}:${month}`]: (result[`${year}:${month}`] || 0) + (toInt(totalRevocations) || 0) };
      }, {},
    );
    const chartData = Object.entries(yearAndMonthToCount).map(([yearAndMonth, count]) => {
      const [year, month] = yearAndMonth.split(':');
      return { year, month, count };
    });

    const months = getMonthCountFromMetricPeriodMonthsToggle(props.metricPeriodMonths);
    const sortedChartData = sortFilterAndSupplementMostRecentMonths(chartData, months, 'count', 0);
    const labels = monthNamesAllWithYearsFromNumbers(sortedChartData.map((element) => element.month), false)
    const dataPoints = (sortedChartData.map((element) => element.count));

    centerSingleMonthDatasetIfNecessary(dataPoints, labels);
    setChartLabels(labels);
    setChartDataPoints(dataPoints);
  };

  useEffect(() => {
    fetchChartData(
      'us_mo', 'newRevocations', 'revocations_matrix_by_month',
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

  const datasets = [{
    label: 'Revocations',
    borderColor: COLORS['lantern-light-blue'],
    pointBackgroundColor: COLORS['lantern-light-blue'],
    fill: false,
    lineTension: 0,
    borderWidth: 2,
    data: chartDataPoints,
    backgroundColor: COLORS['lantern-light-blue'],
    hoverBackgroundColor: COLORS['lantern-light-blue'],
    hoverBorderColor: COLORS['lantern-light-blue']
  }];
  const maxElement = Math.max.apply(Math, chartDataPoints);
  const maxValue = maxElement <= 3 ? 5 : maxElement;

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      display: false,
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
          labelString: 'People revoked',
        },
        ticks: {
          min: 0,
          callback(value) {
            if (value % 1 === 0) {
              return value;
            }
          },
          suggestedMax: maxValue,
        },
      }],
    },
    tooltips: {
      backgroundColor: COLORS['grey-800-light'],
      mode: 'x',
      callbacks: {
        title: (tooltipItem) => labelCurrentMonth(tooltipItem, chartLabels),
      },
    },
    annotation: currentMonthBox('currentMonthBoxRevocationsOverTime', chartLabels),
  };

  const countZero = chartDataPoints.filter(item => item === 0).length;

  const lineChart  = (
    <Line
      id={chartId}
      data={{
        labels: chartLabels,
        datasets,
      }}
      options={options}
    />
  );
  let barOptions = options;
  barOptions.scales.xAxes[0].ticks.barThickness = 'flex';
  barOptions.scales.xAxes[0].barPercentage = 0.08;

  const barChart = (
    <Bar
      id={chartId}
      width={50}
      data={{
        labels: chartLabels,
        datasets
      }}
      options={barOptions}
    />
  );


  if (awaitingResults(loading, user, awaitingApi)) {
    return <Loading />;
  }
  const chart = countZero > 2 ? barChart : lineChart;
  return (
    <div>
      <h4>
        Number of people revoked to prison per month
        <ExportMenu
          chartId={chartId}
          chart={chart}
          metricTitle="Number of people revoked to prison per month"
          timeWindowDescription={getTrailingLabelFromMetricPeriodMonthsToggle(props.metricPeriodMonths)}
          filters={props.filterStates}
        />
      </h4>
      <h6 className="pB-20">
        {getTrailingLabelFromMetricPeriodMonthsToggle(props.metricPeriodMonths)}
      </h6>

      <div className="chart-container fs-block" style={{ position: 'relative', height: '180px' }}>
        {chart}
      </div>
    </div>
  );
};

export default RevocationsOverTime;
