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

import { COLORS, COLORS_GOOD_BAD } from '../../../assets/scripts/constants/colors';
import { configureDownloadButtons } from '../../../assets/scripts/utils/downloads';
import {
  toggleLabel, getMonthCountFromTimeWindowToggle, updateTooltipForMetricType,
  filterDatasetByDistrict,
} from '../../../utils/charts/toggles';
import { sortFilterAndSupplementMostRecentMonths } from '../../../utils/transforms/datasets';
import { toInt } from '../../../utils/transforms/labels';
import { monthNamesWithYearsFromNumbers } from '../../../utils/transforms/months';

const AdmissionsVsReleases = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);
  const [chartColors, setChartColors] = useState([]);

  const chartId = 'admissionsVsReleases';

  const processResponse = () => {
    const { admissionsVsReleases } = props;

    const filteredAdmissionsVsReleases = filterDatasetByDistrict(
      admissionsVsReleases, props.district,
    );

    const dataPoints = [];
    if (filteredAdmissionsVsReleases) {
      filteredAdmissionsVsReleases.forEach((data) => {
        const { year, month } = data;
        const delta = toInt(data.population_change);
        const monthEndPopulation = toInt(data.month_end_population);

        if (props.metricType === 'counts') {
          const value = delta;
          dataPoints.push({ year, month, value });
        } else if (props.metricType === 'rates') {
          // For rates, the value is the delta value over the size of the population at the end of
          // the previous month. If the population in question was 0, then we set the value to
          // either positive 100% (if the delta is positive) or a negative 100% (if the delta is
          // negative) or 0% (if there was no change at all).
          let value = 100.00;
          if (monthEndPopulation !== 0) {
            value = (100 * (delta / monthEndPopulation)).toFixed(2);
          } else if (delta < 0) {
            value = -100.00;
          } else if (delta === 0) {
            value = 0;
          }
          dataPoints.push({ year, month, value });
        }
      });
    }

    const months = getMonthCountFromTimeWindowToggle(props.timeWindow);
    const sorted = sortFilterAndSupplementMostRecentMonths(dataPoints, months, 'value', 0);

    const colorsForValues = [];
    sorted.forEach((dataPoint) => {
      if (dataPoint.value > 0) {
        colorsForValues.push([COLORS_GOOD_BAD.bad]);
      } else {
        colorsForValues.push([COLORS_GOOD_BAD.good]);
      }
    });

    setChartLabels(monthNamesWithYearsFromNumbers(sorted.map((element) => element.month), false));
    setChartDataPoints(sorted.map((element) => element.value));
    setChartColors(colorsForValues);
  };

  useEffect(() => {
    processResponse();
  }, [
    props.admissionsVsReleases,
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
          label: toggleLabel(
            {
              counts: 'Admissions versus releases',
              rates: 'Percent change in incarcerated population',
            },
            props.metricType,
          ),
          backgroundColor: chartColors,
          hoverBackgroundColor: chartColors,
          fill: false,
          data: chartDataPoints,
        }],
      }}
      options={{
        legend: {
          display: false,
          position: 'right',
          labels: {
            usePointStyle: true,
            boxWidth: 20,
          },
        },
        tooltips: {
          backgroundColor: COLORS['grey-800-light'],
          mode: 'x',
          callbacks: {
            label: (tooltipItem, data) => updateTooltipForMetricType(
              props.metricType, tooltipItem, data,
            ),
          },
        },
        scales: {
          xAxes: [{
            ticks: {
              autoSkip: true,
            },
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: toggleLabel(
                {
                  counts: 'Admissions versus releases',
                  rates: 'Percent change in incarcerated population',
                },
                props.metricType,
              ),
            },
          }],
        },
      }}
    />
  );

  const exportedStructureCallback = () => (
    {
      metric: 'Admissions versus releases',
      series: [],
    });

  configureDownloadButtons(chartId, 'ADMISSIONS VERSUS RELEASES',
    chart.props.data.datasets, chart.props.data.labels,
    document.getElementById(chartId), exportedStructureCallback, props, true, true);

  const chartData = chart.props.data.datasets[0].data;
  const mostRecentValue = chartData[chartData.length - 1];

  const header = document.getElementById(props.header);

  if (header && (mostRecentValue !== null)) {
    let title = '';
    if (mostRecentValue === 0) {
      title = `The ND facilities <b style='color:#809AE5'> have not changed in size</b> this month.`;
    } else {
      const direction = (mostRecentValue > 0) ? 'grew' : 'shrank';
      title = `The ND facilities <b style='color:#809AE5'>${direction} by ${Math.abs(mostRecentValue)} people</b> this month.`;
    }

    header.innerHTML = title;
  }

  return chart;
};

export default AdmissionsVsReleases;
