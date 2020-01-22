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

import { COLORS, COLORS_STACKED_TWO_VALUES } from '../../../assets/scripts/constants/colors';
import { configureDownloadButtons } from '../../../assets/scripts/utils/downloads';
import {
  toggleLabel, getMonthCountFromTimeWindowToggle, updateTooltipForMetricType,
  filterDatasetByDistrict, toggleYAxisTicksStackedRateBasicCount,
} from '../../../utils/charts/toggles';
import { sortFilterAndSupplementMostRecentMonths } from '../../../utils/transforms/datasets';
import { monthNamesWithYearsFromNumbers } from '../../../utils/transforms/months';

const RevocationCountBySupervisionType = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [paroleDataPoints, setParoleDataPoints] = useState([]);
  const [probationDataPoints, setProbationDataPoints] = useState([]);

  const chartId = 'revocationsBySupervisionType';

  const processResponse = () => {
    const { revocationCountsByMonthBySupervisionType: countsByMonth } = props;

    const filteredCountsByMonth = filterDatasetByDistrict(
      countsByMonth, props.district,
    );

    const paroleData = [];
    const probationData = [];
    if (filteredCountsByMonth) {
      filteredCountsByMonth.forEach((data) => {
        const {
          year, month, parole_count: paroleCount, probation_count: probationCount,
        } = data;

        const paroleCountNum = Number(paroleCount);
        const probationCountNum = Number(probationCount);

        if (props.metricType === 'counts') {
          paroleData.push({ year, month, paroleValue: paroleCountNum });
          probationData.push({ year, month, probationValue: probationCountNum });
        } else if (props.metricType === 'rates') {
          const paroleValue = (100 * (paroleCountNum / (paroleCountNum + probationCountNum)))
            .toFixed(2);
          const probationValue = (100 * (probationCountNum / (paroleCountNum + probationCountNum)))
            .toFixed(2);

          paroleData.push({ year, month, paroleValue });
          probationData.push({ year, month, probationValue });
        }
      });
    }

    const months = getMonthCountFromTimeWindowToggle(props.timeWindow);
    const sortedParoleData = sortFilterAndSupplementMostRecentMonths(paroleData, months, 'paroleValue', 0);
    const sortedProbationData = sortFilterAndSupplementMostRecentMonths(probationData, months, 'probationValue', 0);

    setChartLabels(monthNamesWithYearsFromNumbers(sortedParoleData.map(
      (element) => element.month,
    ), false));
    setParoleDataPoints(sortedParoleData.map((element) => element.paroleValue));
    setProbationDataPoints(sortedProbationData.map((element) => element.probationValue));
  };

  useEffect(() => {
    processResponse();
  }, [
    props.revocationCountsByMonthBySupervisionType,
    props.metricType,
    props.timeWindow,
    props.district,
  ]);

  const chart = (
    <Bar
      id={chartId}
      data={{
        labels: chartLabels,
        datasets: [{
          label: 'Probation',
          type: 'bar',
          backgroundColor: COLORS_STACKED_TWO_VALUES[0],
          hoverBackgroundColor: COLORS_STACKED_TWO_VALUES[0],
          hoverBorderColor: COLORS_STACKED_TWO_VALUES[0],
          data: probationDataPoints,
        }, {
          label: 'Parole',
          type: 'bar',
          backgroundColor: COLORS_STACKED_TWO_VALUES[1],
          hoverBackgroundColor: COLORS_STACKED_TWO_VALUES[1],
          hoverBorderColor: COLORS_STACKED_TWO_VALUES[1],
          data: paroleDataPoints,
        },
        ],
      }}
      options={{
        responsive: true,
        legend: {
          position: 'bottom',
        },
        tooltips: {
          backgroundColor: COLORS['grey-800-light'],
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (tooltipItem, data) => updateTooltipForMetricType(
              props.metricType, tooltipItem, data,
            ),
          },
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Month',
            },
            stacked: true,
          }],
          yAxes: [{
            ticks: toggleYAxisTicksStackedRateBasicCount(props.metricType, undefined),
            scaleLabel: {
              display: true,
              labelString: toggleLabel(
                { counts: 'Revocation count', rates: 'Percentage' },
                props.metricType,
              ),
            },
            stacked: true,
          }],
        },
      }}
    />
  );

  const exportedStructureCallback = () => (
    {
      metric: 'Revocation counts by supervision type',
      series: [],
    });

  configureDownloadButtons(chartId, 'REVOCATIONS BY SUPERVISION TYPE',
    chart.props.data.datasets, chart.props.data.labels,
    document.getElementById(chartId), exportedStructureCallback, props, true, true);

  return chart;
};

export default RevocationCountBySupervisionType;
