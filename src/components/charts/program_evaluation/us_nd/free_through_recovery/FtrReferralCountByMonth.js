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

import { COLORS } from '../../../../../assets/scripts/constants/colors';
import { configureDownloadButtons } from '../../../../../assets/scripts/utils/downloads';
import {
  toggleLabel, getMonthCountFromTimeWindowToggle, updateTooltipForMetricType,
  filterDatasetBySupervisionType, filterDatasetByDistrict, centerSingleMonthDatasetIfNecessary,
} from '../../../../../utils/charts/toggles';
import { sortFilterAndSupplementMostRecentMonths } from '../../../../../utils/transforms/datasets';
import { toInt } from '../../../../../utils/transforms/labels';
import { monthNamesWithYearsFromNumbers } from '../../../../../utils/transforms/months';

const FtrReferralCountByMonth = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  const chartId = 'ftrReferralCountByMonth';

  const processResponse = () => {
    const { ftrReferralCountByMonth: countsByMonth } = props;

    let filteredCountsByMonth = filterDatasetBySupervisionType(
      countsByMonth, props.supervisionType,
      ['state_code', 'year', 'month', 'district'], ['count', 'total_supervision_count'],
    );

    filteredCountsByMonth = filterDatasetByDistrict(
      filteredCountsByMonth, props.district,
      ['state_code', 'year', 'month'], ['count', 'total_supervision_count'],
    );

    const dataPoints = [];
    if (filteredCountsByMonth) {
      filteredCountsByMonth.forEach((data) => {
        const { year, month } = data;
        const referralCount = toInt(data.count);
        const supervisionCount = toInt(data.total_supervision_count);

        if (props.metricType === 'counts') {
          const value = referralCount;
          dataPoints.push({ year, month, value });
        } else if (props.metricType === 'rates') {
          const value = (100 * (referralCount / supervisionCount)).toFixed(2);
          dataPoints.push({ year, month, value });
        }
      });
    }

    const months = getMonthCountFromTimeWindowToggle(props.timeWindow);
    const sorted = sortFilterAndSupplementMostRecentMonths(dataPoints, months, 'value', 0);
    const chartDataValues = (sorted.map((element) => element.value));
    const monthNames = monthNamesWithYearsFromNumbers(sorted.map((element) => element.month), false);

    centerSingleMonthDatasetIfNecessary(chartDataValues, monthNames);
    setChartLabels(monthNames);
    setChartDataPoints(chartDataValues);
  };

  useEffect(() => {
    processResponse();
  }, [
    props.ftrReferralCountByMonth,
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
        datasets: [{
          label: toggleLabel(
            { counts: 'Referral count', rates: 'Referral rate' },
            props.metricType,
          ),
          backgroundColor: COLORS['grey-500'],
          borderColor: COLORS['grey-500'],
          pointBackgroundColor: COLORS['grey-500'],
          pointHoverBackgroundColor: COLORS['grey-500'],
          pointHoverBorderColor: COLORS['grey-500'],
          fill: false,
          borderWidth: 2,
          data: chartDataPoints,
        }],
      }}
      options={{
        legend: {
          display: false,
          position: 'bottom',
          labels: {
            usePointStyle: true,
            boxWidth: 10,
          },
        },
        scales: {
          xAxes: [{
            ticks: {
              autoSkip: true,
            },
          }],
          yAxes: [{
            ticks: {
              min: 0,
            },
            scaleLabel: {
              display: true,
              labelString: toggleLabel(
                { counts: 'Referral count', rates: 'Referral rate' },
                props.metricType,
              ),
            },
          }],
        },
        tooltips: {
          backgroundColor: COLORS['grey-800-light'],
          mode: 'x',
          callbacks: {
            label: (tooltipItem, data) => updateTooltipForMetricType(props.metricType, tooltipItem, data),
          },
        },
      }}
    />
  );

  const exportedStructureCallback = () => (
    {
      metric: 'FTR referral counts by month',
      series: [],
    });

  configureDownloadButtons(chartId, 'FTR REFERRAL COUNT BY MONTH',
    chart.props.data.datasets, chart.props.data.labels,
    document.getElementById(chartId), exportedStructureCallback, true, true);

  const chartData = chart.props.data.datasets[0].data;
  const mostRecentValue = chartData[chartData.length - 1];

  const header = document.getElementById(props.header);

  if (header && mostRecentValue !== null) {
    const title = `There have been <b style='color:#809AE5'>${mostRecentValue} referrals</b> to Free Through Recovery this month so far.`;
    header.innerHTML = title;
  } else if (header) {
    header.innerHTML = '';
  }

  return (chart);
};

export default FtrReferralCountByMonth;
