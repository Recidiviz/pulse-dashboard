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
import { Line } from 'react-chartjs-2';

import { COLORS } from '../../../assets/scripts/constants/colors';
import { configureDownloadButtons } from '../../../assets/scripts/utils/downloads';
import { toInt } from '../../../utils/transforms/labels';
import { sortFilterAndSupplementMostRecentMonths } from '../../../utils/transforms/datasets';
import { monthNamesWithYearsFromNumbers } from '../../../utils/transforms/months';
import {
  getGoalForChart, getMinForGoalAndData, getMaxForGoalAndData, trendlineGoalText,
  chartAnnotationForGoal,
} from '../../../utils/charts/metricGoal';
import {
  getMonthCountFromTimeWindowToggle, filterDatasetBySupervisionType, filterDatasetByDistrict,
  updateTooltipForMetricType, toggleLabel, canDisplayGoal, toggleYAxisTicksAdditionalOptions,
  centerSingleMonthDatasetIfNecessary,
} from '../../../utils/charts/toggles';
import { generateTrendlineDataset } from '../../../utils/charts/trendline';

const SupervisionSuccessSnapshot = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);
  const [chartMinValue, setChartMinValue] = useState();
  const [chartMaxValue, setChartMaxValue] = useState();

  const chartId = 'supervisionSuccessSnapshot';
  const GOAL = getGoalForChart('US_ND', chartId);
  const stepSize = 10;

  const processResponse = () => {
    const { supervisionSuccessRates: countsByMonth } = props;

    let filteredCountsByMonth = filterDatasetBySupervisionType(
      countsByMonth, props.supervisionType,
      ['state_code', 'projected_year', 'projected_month', 'district'],
      ['successful_termination', 'revocation_termination'],
    );

    filteredCountsByMonth = filterDatasetByDistrict(
      filteredCountsByMonth, props.district,
      ['state_code', 'projected_year', 'projected_month'],
      ['successful_termination', 'revocation_termination'],
    );

    const today = new Date();
    const yearNow = today.getFullYear();
    const monthNow = today.getMonth() + 1;

    const dataPoints = [];
    if (filteredCountsByMonth) {
      filteredCountsByMonth.forEach((data) => {
        let { projected_year: year, projected_month: month } = data;
        const successful = toInt(data.successful_termination);
        const revocation = toInt(data.revocation_termination);

        let successRate = 0.00;
        if (successful + revocation !== 0) {
          successRate = (100 * (successful / (successful + revocation))).toFixed(2);
        }

        year = toInt(year);
        month = toInt(month);

        // Don't add completion rates for months in the future
        if (year < yearNow || (year === yearNow && month <= monthNow)) {
          if (props.metricType === 'counts') {
            dataPoints.push({ year, month, value: successful });
          } else if (props.metricType === 'rates') {
            dataPoints.push({ year, month, value: successRate });
          }
        }
      });
    }
    const months = getMonthCountFromTimeWindowToggle(props.timeWindow);
    const sorted = sortFilterAndSupplementMostRecentMonths(
      dataPoints, months, 'value', '0',
    );
    const chartDataValues = (sorted.map((element) => element.value));
    const min = getMinForGoalAndData(GOAL.value, chartDataValues, stepSize);
    const max = getMaxForGoalAndData(GOAL.value, chartDataValues, stepSize);
    const monthNames = monthNamesWithYearsFromNumbers(sorted.map((element) => element.month), true);

    centerSingleMonthDatasetIfNecessary(chartDataValues, monthNames);
    setChartLabels(monthNames);
    setChartDataPoints(chartDataValues);
    setChartMinValue(min);
    setChartMaxValue(max);
  };

  function goalLineIfApplicable() {
    if (canDisplayGoal(GOAL, props)) {
      return chartAnnotationForGoal(GOAL, 'supervisionSuccessSnapshotGoalLine', { yAdjust: 10 });
    }
    return null;
  }

  function datasetsWithTrendlineIfApplicable() {
    const datasets = [{
      label: toggleLabel(
        { counts: 'Successful completions', rates: 'Success rate' },
        props.metricType,
      ),
      backgroundColor: COLORS['blue-standard'],
      borderColor: COLORS['blue-standard'],
      pointBackgroundColor: COLORS['blue-standard'],
      pointHoverBackgroundColor: COLORS['blue-standard'],
      pointHoverBorderColor: COLORS['blue-standard'],
      pointRadius: 4,
      hitRadius: 5,
      fill: false,
      borderWidth: 2,
      lineTension: 0,
      data: chartDataPoints,
    }];
    if (canDisplayGoal(GOAL, props)) {
      datasets.push(generateTrendlineDataset(chartDataPoints, COLORS['blue-standard-light']));
    }
    return datasets;
  }

  useEffect(() => {
    processResponse();
  }, [
    props.supervisionSuccessRates,
    props.metricType,
    props.timeWindow,
    props.supervisionType,
    props.district,
  ]);

  const chart = (
    <Line
      id={chartId}
      data={{
        labels: chartLabels,
        datasets: datasetsWithTrendlineIfApplicable(),
      }}
      options={{
        legend: {
          display: false,
          position: 'right',
          labels: {
            usePointStyle: true,
            boxWidth: 5,
          },
        },
        tooltips: {
          backgroundColor: COLORS['grey-800-light'],
          enabled: true,
          mode: 'point',
          callbacks: {
            label: (tooltipItem, data) => updateTooltipForMetricType(
              props.metricType, tooltipItem, data,
            ),
          },
        },
        scales: {
          xAxes: [{
            ticks: {
              fontColor: COLORS['grey-600'],
              autoSkip: true,
            },
            scaleLabel: {
              display: true,
              labelString: 'Month of scheduled supervision termination',
              fontColor: COLORS['grey-500'],
              fontStyle: 'bold',
            },
            gridLines: {
              color: '#FFF',
            },
          }],
          yAxes: [{
            ticks: toggleYAxisTicksAdditionalOptions(
              'rates', props.metricType, chartMinValue, chartMaxValue, stepSize,
              { fontColor: COLORS['grey-600'] },
            ),
            scaleLabel: {
              display: true,
              labelString: toggleLabel(
                { counts: 'Successful completions', rates: '% of people' },
                props.metricType,
              ),
              fontColor: COLORS['grey-500'],
              fontStyle: 'bold',
            },
            gridLines: {
              color: COLORS['grey-300'],
            },
          }],
        },
        annotation: goalLineIfApplicable(),
      }}
    />
  );

  const exportedStructureCallback = function exportedStructureCallback() {
    return {
      metric: 'Percentage of successful completion of supervision',
      series: [],
    };
  };

  configureDownloadButtons(chartId, 'SUCCESSFUL COMPLETION OF SUPERVISION', chart.props.data.datasets,
    chart.props.data.labels, document.getElementById(chartId),
    exportedStructureCallback, true, true);

  const header = document.getElementById(props.header);

  if (header && canDisplayGoal(GOAL, props)) {
    const trendlineValues = chart.props.data.datasets[1].data;
    const trendlineText = trendlineGoalText(trendlineValues, GOAL);

    const title = `The rate of successful completion of supervision has been <b style='color:#809AE5'>trending ${trendlineText}.</b>`;
    header.innerHTML = title;
  } else if (header) {
    header.innerHTML = '';
  }

  return (chart);
};

export default SupervisionSuccessSnapshot;
