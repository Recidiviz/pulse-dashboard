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

import { COLORS, COLORS_FIVE_VALUES } from '../../../assets/scripts/constants/colors';
import { configureDownloadButtons } from '../../../assets/scripts/utils/downloads';
import {
  toggleLabel, getMonthCountFromTimeWindowToggle, updateTooltipForMetricType,
  filterDatasetBySupervisionType, filterDatasetByDistrict,
} from '../../../utils/charts/toggles';
import { sortFilterAndSupplementMostRecentMonths } from '../../../utils/transforms/datasets';
import { monthNamesWithYearsFromNumbers } from '../../../utils/transforms/months';

const RevocationCountByViolationType = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [absconsionDataPoints, setAbsconsionDataPoints] = useState([]);
  const [newOffenseDataPoints, setNewOffenseDataPoints] = useState([]);
  const [technicalDataPoints, setTechnicalDataPoints] = useState([]);
  const [unknownDataPoints, setUnknownDataPoints] = useState([]);

  const chartId = 'revocationsByViolationType';

  const processResponse = () => {
    const { revocationCountsByMonthByViolationType: countsByMonth } = props;

    let filteredCountsByMonth = filterDatasetBySupervisionType(
      countsByMonth, props.supervisionType,
      ['state_code', 'year', 'month', 'district'],
      ['absconsion_count', 'felony_count', 'technical_count', 'unknown_count'],
    );

    filteredCountsByMonth = filterDatasetByDistrict(
      filteredCountsByMonth, props.district,
      ['state_code', 'year', 'month'],
      ['absconsion_count', 'felony_count', 'technical_count', 'unknown_count'],
    );

    const dataPoints = [];
    if (filteredCountsByMonth) {
      filteredCountsByMonth.forEach((data) => {
        const {
          year, month, absconsion_count: absconsionCount,
          felony_count: felonyCount, technical_count: technicalCount,
          unknown_count: unknownCount,
        } = data;

        const monthCounts = {
          ABSCONDED: absconsionCount,
          FELONY: felonyCount,
          TECHNICAL: technicalCount,
          UNKNOWN_VIOLATION_TYPE: unknownCount,
        };
        const totalCount = Number(absconsionCount) + Number(felonyCount) + Number(technicalCount) + Number(unknownCount);

        if (props.metricType === 'counts') {
          dataPoints.push({ year, month, monthDict: monthCounts });
        } else if (props.metricType === 'rates') {
          const monthRates = {};
          Object.keys(monthCounts).forEach((key) => {
            const count = monthCounts[key];
            monthRates[key] = (100 * (count / totalCount)).toFixed(2);
          });

          dataPoints.push({ year, month, monthDict: monthRates });
        }
      });
    }

    const emptyMonthDict = {
      ABSCONDED: 0,
      FELONY: 0,
      TECHNICAL: 0,
      UNKNOWN_VIOLATION_TYPE: 0,
    };

    const months = getMonthCountFromTimeWindowToggle(props.timeWindow);
    const sorted = sortFilterAndSupplementMostRecentMonths(dataPoints, months, 'monthDict', emptyMonthDict);
    const monthsLabels = [];
    const violationArrays = {
      ABSCONDED: [],
      FELONY: [],
      TECHNICAL: [],
      UNKNOWN_VIOLATION_TYPE: [],
    };

    for (let i = 0; i < months; i += 1) {
      monthsLabels.push(sorted[i].month);
      const data = sorted[i].monthDict;
      Object.keys(data).forEach((violationType) => {
        violationArrays[violationType].push(data[violationType]);
      });
    }

    setChartLabels(monthNamesWithYearsFromNumbers(monthsLabels, false));
    setAbsconsionDataPoints(violationArrays.ABSCONDED);
    setNewOffenseDataPoints(violationArrays.FELONY);
    setTechnicalDataPoints(violationArrays.TECHNICAL);
    setUnknownDataPoints(violationArrays.UNKNOWN_VIOLATION_TYPE);
  };

  useEffect(() => {
    processResponse();
  }, [
    props.revocationCountsByMonthByViolationType,
    props.metricType,
    props.timeWindow,
    props.supervisionType,
    props.district,
  ]);

  const chart = (
    <Bar
      id={chartId}
      data={{
        labels: chartLabels,
        datasets: [{
          label: 'Absconsion',
          backgroundColor: COLORS_FIVE_VALUES[0],
          hoverBackgroundColor: COLORS_FIVE_VALUES[0],
          hoverBorderColor: COLORS_FIVE_VALUES[0],
          data: absconsionDataPoints,
        }, {
          label: 'New Offense',
          backgroundColor: COLORS_FIVE_VALUES[1],
          hoverBackgroundColor: COLORS_FIVE_VALUES[1],
          hoverBorderColor: COLORS_FIVE_VALUES[1],
          data: newOffenseDataPoints,
        }, {
          label: 'Technical',
          backgroundColor: COLORS_FIVE_VALUES[2],
          hoverBackgroundColor: COLORS_FIVE_VALUES[2],
          hoverBorderColor: COLORS_FIVE_VALUES[2],
          data: technicalDataPoints,
        }, {
          label: 'Unknown Type',
          backgroundColor: COLORS_FIVE_VALUES[3],
          hoverBackgroundColor: COLORS_FIVE_VALUES[3],
          hoverBorderColor: COLORS_FIVE_VALUES[3],
          data: unknownDataPoints,
        },
        ],
      }}
      options={{
        responsive: true,
        legend: {
          position: 'bottom',
          boxWidth: 10,
        },
        tooltips: {
          backgroundColor: COLORS['grey-800-light'],
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (tooltipItem, data) => updateTooltipForMetricType(props.metricType, tooltipItem, data),
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
            // ticks: props.metricType === 'rates' ? {
            //   max: 100,
            // } : {},
            ticks: {
              max: 100,
            },
            scaleLabel: {
              display: true,
              labelString: toggleLabel(
                { counts: 'Revocation count', rates: 'Percentage of revocations' },
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
      metric: 'Revocation counts by violation type',
      series: [],
    });

  configureDownloadButtons(chartId, 'REVOCATIONS BY VIOLATION TYPE',
    chart.props.data.datasets, chart.props.data.labels,
    document.getElementById(chartId), exportedStructureCallback);

  return chart;
};

export default RevocationCountByViolationType;
