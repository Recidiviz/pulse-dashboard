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
import {
  getGoalForChart, getMinForGoalAndData, getMaxForGoalAndData, trendlineGoalText,
  chartAnnotationForGoal,
} from '../../../utils/charts/metricGoal';
import {
  getMonthCountFromTimeWindowToggle, filterDatasetBySupervisionTypeExplicitAll,
  filterDatasetByDistrictExplicitAll, canDisplayGoal,
} from '../../../utils/charts/toggles';
import {
  generateTrendlineDataset, getTooltipWithoutTrendline,
} from '../../../utils/charts/trendline';
import { sortFilterAndSupplementMostRecentMonths } from '../../../utils/transforms/datasets';
import { monthNamesWithYearsFromNumbers } from '../../../utils/transforms/months';

const LsirScoreChangeSnapshot = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);
  const [chartMinValue, setChartMinValue] = useState();
  const [chartMaxValue, setChartMaxValue] = useState();

  const chartId = 'lsirScoreChangeSnapshot';
  const GOAL = getGoalForChart('US_ND', chartId);
  const stepSize = 0.5;

  const processResponse = () => {
    const { lsirScoreChangeByMonth: changeByMonth } = props;

    let filteredChangeByMonth = filterDatasetBySupervisionTypeExplicitAll(
      changeByMonth, props.supervisionType,
    );

    filteredChangeByMonth = filterDatasetByDistrictExplicitAll(
      filteredChangeByMonth, props.district,
    );

    const dataPoints = [];
    if (filteredChangeByMonth) {
      filteredChangeByMonth.forEach((data) => {
        const { termination_year: year, termination_month: month } = data;
        const change = parseFloat(data.average_change).toFixed(2);

        dataPoints.push({ year, month, change });
      });
    }

    const months = getMonthCountFromTimeWindowToggle(props.timeWindow);
    const sorted = sortFilterAndSupplementMostRecentMonths(dataPoints, months, 'change', '0.0');
    const chartDataValues = sorted.map((element) => element.change);
    const min = getMinForGoalAndData(GOAL.value, chartDataValues, stepSize);
    const max = getMaxForGoalAndData(GOAL.value, chartDataValues, stepSize);

    setChartLabels(monthNamesWithYearsFromNumbers(sorted.map((element) => element.month), true));
    setChartDataPoints(chartDataValues);
    setChartMinValue(min);
    setChartMaxValue(max);
  };

  function goalLineIfApplicable() {
    if (canDisplayGoal(GOAL, props)) {
      return chartAnnotationForGoal(GOAL, 'lsirScoreChangeSnapshotGoalLine', { yAdjust: 10 });
    }
    return null;
  }

  function datasetsWithTrendlineIfApplicable() {
    const datasets = [{
      label: 'LSI-R score changes (average)',
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
    props.lsirScoreChangeByMonth,
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
            label: (tooltipItem, data) => (getTooltipWithoutTrendline(tooltipItem, data)),
          },
        },
        scales: {
          xAxes: [{
            ticks: {
              fontColor: COLORS['grey-600'],
              autoSkip: false,
            },
            scaleLabel: {
              display: true,
              labelString: 'Month of supervision termination',
              fontColor: COLORS['grey-500'],
              fontStyle: 'bold',
            },
            gridLines: {
              color: '#FFF',
            },
          }],
          yAxes: [{
            ticks: {
              fontColor: COLORS['grey-600'],
              min: chartMinValue,
              max: chartMaxValue,
              stepSize,
            },
            scaleLabel: {
              display: true,
              labelString: 'Change in LSI-R scores',
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
      metric: 'Average change in LSI-R score between termination and first reassessment',
      series: [],
    };
  };
  configureDownloadButtons(chartId, 'LSI-R SCORE CHANGES (AVERAGE)', chart.props.data.datasets,
    chart.props.data.labels, document.getElementById(chartId),
    exportedStructureCallback);

  const header = document.getElementById(props.header);

  if (header && canDisplayGoal(GOAL, props)) {
    const trendlineValues = chart.props.data.datasets[1].data;
    const trendlineText = trendlineGoalText(trendlineValues, GOAL);

    const title = `The average change in LSI-R scores between first reassessment and termination of supervision has been <b style='color:#809AE5'> trending ${trendlineText}. </b>`;
    header.innerHTML = title;
  }

  return (chart);
};

export default LsirScoreChangeSnapshot;
