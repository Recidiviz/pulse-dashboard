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
import { configureDownloadButtons } from '../../../../../assets/scripts/utils/downloads';
import { COLORS } from '../../../../../assets/scripts/constants/colors';
import { monthNamesWithYearsFromNumbers } from '../../../../../utils/monthConversion';
import { sortFilterAndSupplementMostRecentMonths } from '../../../../../utils/dataOrganizing';

const FtrReferralCountByMonth = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  const chartId = 'ftrReferralCountByMonth';

  const processResponse = () => {
    const { ftrReferralCountByMonth: countsByMonth } = props;

    const dataPoints = [];
    if (countsByMonth) {
      countsByMonth.forEach((data) => {
        const { year, month, count } = data;
        dataPoints.push({ year, month, count });
      });
    }

    const sorted = sortFilterAndSupplementMostRecentMonths(dataPoints, 6, 'count', 0);
    const chartDataValues = (sorted.map((element) => element.count));

    setChartLabels(monthNamesWithYearsFromNumbers(sorted.map((element) => element.month), false));
    setChartDataPoints(chartDataValues);
  };

  useEffect(() => {
    processResponse();
  }, [props.ftrReferralCountByMonth]);

  const chart = (
    <Line
      id={chartId}
      data={{
        labels: chartLabels,
        datasets: [{
          label: 'Referral count',
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
              autoSkip: false,
            },
          }],
          yAxes: [{
            ticks: {
              min: 0,
            },
            scaleLabel: {
              display: true,
              labelString: 'Referral count',
            },
          }],
        },
        tooltips: {
          backgroundColor: COLORS['grey-800-light'],
          mode: 'x',
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
    document.getElementById(chartId), exportedStructureCallback);

  const chartData = chart.props.data.datasets[0].data;
  const mostRecentValue = chartData[chartData.length - 1];

  const header = document.getElementById(props.header);

  if (header && (mostRecentValue !== null)) {
    const title = `There have been <b style='color:#809AE5'>${mostRecentValue} referrals</b> to Free Through Recovery this month so far.`;
    header.innerHTML = title;
  }

  return (chart);
};

export default FtrReferralCountByMonth;
