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
import { sortFilterAndSupplementMostRecentMonths } from '../../../utils/transforms/datasets';
import { toInt } from '../../../utils/transforms/labels';
import { monthNamesWithYearsFromNumbers } from '../../../utils/transforms/months';
import {
  getGoalForChart, getMinForGoalAndData, getMaxForGoalAndData, trendlineGoalText,
  chartAnnotationForGoal,
} from '../../../utils/charts/metricGoal';
import {
  getMonthCountFromTimeWindowToggle, filterDatasetByDistrict, updateTooltipForMetricType,
  toggleLabel, canDisplayGoal, toggleYAxisTicksAdditionalOptions,
  centerSingleMonthDatasetIfNecessary,
} from '../../../utils/charts/toggles';
import { generateTrendlineDataset } from '../../../utils/charts/trendline';

const RevocationAdmissionsSnapshot = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);
  const [chartMinValue, setChartMinValue] = useState();
  const [chartMaxValue, setChartMaxValue] = useState();

  const chartId = 'revocationAdmissionsSnapshot';
  const GOAL = getGoalForChart('US_ND', chartId);
  const stepSize = 10;

  const processResponse = () => {
    const { revocationAdmissionsByMonth: countsByMonth } = props;

    const filteredCountsByMonth = filterDatasetByDistrict(
      countsByMonth, props.district,
      ['state_code', 'year', 'month'],
      ['new_admissions', 'technicals', 'non_technicals', 'unknown_revocations'],
    );

    const dataPoints = [];
    if (filteredCountsByMonth) {
      filteredCountsByMonth.forEach((data) => {
        const { year, month } = data;
        const newAdmissions = toInt(data.new_admissions);
        const technicals = toInt(data.technicals);
        const nonTechnicals = toInt(data.non_technicals);
        const unknownRevocations = toInt(data.unknown_revocations);
        const total = technicals + nonTechnicals + unknownRevocations + newAdmissions;
        const revocations = (technicals + nonTechnicals + unknownRevocations);

        let percentRevocations = 0.00;
        if (total !== 0) {
          percentRevocations = (100 * (revocations / total)).toFixed(2);
        }

        if (props.metricType === 'counts') {
          dataPoints.push({ year, month, value: revocations });
        } else if (props.metricType === 'rates') {
          dataPoints.push({ year, month, value: percentRevocations });
        }
      });
    }

    const months = getMonthCountFromTimeWindowToggle(props.timeWindow);
    const sorted = sortFilterAndSupplementMostRecentMonths(
      dataPoints, months, 'value', '0',
    );
    const chartDataValues = sorted.map((element) => element.value);
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
      return chartAnnotationForGoal(GOAL, 'revocationAdmissionsSnapshotGoalLine', { yAdjust: 10 });
    }
    return null;
  }

  function datasetsWithTrendlineIfApplicable() {
    const datasets = [{
      label: toggleLabel(
        { counts: 'Revocation admissions', rates: 'Percentage from revocations' },
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
    props.revocationAdmissionsByMonth,
    props.metricType,
    props.timeWindow,
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
              labelString: 'Month',
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
                { counts: 'Revocation admissions', rates: '% of admissions' },
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
      metric: 'Percentage of admissions from revocations',
      series: [],
    };
  };
  configureDownloadButtons(chartId, 'PRISON ADMISSIONS DUE TO REVOCATION', chart.props.data.datasets,
    chart.props.data.labels, document.getElementById(chartId),
    exportedStructureCallback, true, true);

  const header = document.getElementById(props.header);

  if (header && canDisplayGoal(GOAL, props)) {
    const trendlineValues = chart.props.data.datasets[1].data;
    const trendlineText = trendlineGoalText(trendlineValues, GOAL);

    const title = `The percent of prison admissions due to revocations of probation and parole has been <b style='color:#809AE5'>trending ${trendlineText}.</b>`;
    header.innerHTML = title;
  } else if (header) {
    header.innerHTML = '';
  }

  return (chart);
};

export default RevocationAdmissionsSnapshot;
