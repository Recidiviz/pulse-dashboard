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

import {
  COLORS_STACKED_TWO_VALUES_ALT, COLORS,
} from '../../../../../assets/scripts/constants/colors';
import { configureDownloadButtons } from '../../../../../assets/scripts/utils/downloads';
import {
  filterDatasetBySupervisionType, filterDatasetByDistrict, filterDatasetByTimeWindow,
} from '../../../../../utils/charts/toggles';
import { tooltipForCountChart, tooltipForRateChart } from '../../../../../utils/charts/tooltips';
import { sortByLabel } from '../../../../../utils/transforms/datasets';
import { genderValueToHumanReadable, toInt } from '../../../../../utils/transforms/labels';

const FtrReferralsByGender = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [ftrReferralProportions, setFtrReferralProportions] = useState([]);
  const [stateSupervisionProportions, setStateSupervisionProportions] = useState([]);
  const [ftrReferralCounts, setFtrReferralCounts] = useState([]);
  const [stateSupervisionCounts, setStateSupervisionCounts] = useState([]);

  const chartId = 'ftrReferralsByGender';

  const processResponse = () => {
    const { ftrReferralsByGender } = props;
    const { supervisionPopulationByGender } = props;

    let filteredFtrReferrals = filterDatasetBySupervisionType(
      ftrReferralsByGender, props.supervisionType,
      ['state_code', 'time_window', 'gender', 'district'], ['count'],
    );

    filteredFtrReferrals = filterDatasetByDistrict(
      filteredFtrReferrals, props.district,
      ['state_code', 'time_window', 'gender'], ['count'],
    );

    filteredFtrReferrals = filterDatasetByTimeWindow(filteredFtrReferrals, props.timeWindow);

    let filteredSupervisionPopulation = filterDatasetBySupervisionType(
      supervisionPopulationByGender, props.supervisionType,
      ['state_code', 'time_window', 'gender', 'district'], ['count'],
    );

    filteredSupervisionPopulation = filterDatasetByDistrict(
      filteredSupervisionPopulation, props.district,
      ['state_code', 'time_window', 'gender'], ['count'],
    );

    filteredSupervisionPopulation = filterDatasetByTimeWindow(
      filteredSupervisionPopulation, props.timeWindow,
    );

    const ftrReferralDataPoints = [];
    if (filteredFtrReferrals) {
      filteredFtrReferrals.forEach((data) => {
        let { gender } = data;
        gender = genderValueToHumanReadable(gender);
        const count = toInt(data.count, 10);
        ftrReferralDataPoints.push({ gender, count });
      });
    }

    const supervisionDataPoints = [];
    if (filteredSupervisionPopulation) {
      filteredSupervisionPopulation.forEach((data) => {
        const { gender } = data;
        const count = toInt(data.count);
        supervisionDataPoints.push({ gender, count });
      });
    }

    function totalSum(dataPoints) {
      if (dataPoints.length > 0) {
        return dataPoints.map((element) => element.count).reduce(
          (previousValue, currentValue) => (previousValue + currentValue),
        );
      }
      return 0;
    }

    const totalFtrReferrals = totalSum(ftrReferralDataPoints);
    const totalSupervisionPopulation = totalSum(supervisionDataPoints);

    // Sort by gender alphabetically
    const sortedFtrReferralsDataPoints = sortByLabel(ftrReferralDataPoints, 'gender');
    const sortedSupervisionDataPoints = sortByLabel(supervisionDataPoints, 'gender');

    setChartLabels(sortedFtrReferralsDataPoints.map((element) => element.gender));
    setFtrReferralProportions(sortedFtrReferralsDataPoints.map(
      (element) => (100 * (element.count / totalFtrReferrals)),
    ));
    setFtrReferralCounts(sortedFtrReferralsDataPoints.map(
      (element) => (element.count),
    ));
    setStateSupervisionProportions(sortedSupervisionDataPoints.map(
      (element) => (100 * (element.count / totalSupervisionPopulation)),
    ));
    setStateSupervisionCounts(sortedSupervisionDataPoints.map(
      (element) => (element.count),
    ));
  };

  useEffect(() => {
    processResponse();
  }, [
    props.ftrReferralsByGender,
    props.supervisionPopulationByGender,
    props.metricType,
    props.timeWindow,
    props.supervisionType,
    props.district,
  ]);

  const countsChart = (
    <Bar
      id={chartId}
      data={{
        labels: chartLabels,
        datasets: [
          {
            label: 'Referrals',
            backgroundColor: COLORS['blue-standard'],
            hoverBackgroundColor: COLORS['blue-standard'],
            yAxisID: 'y-axis-left',
            data: ftrReferralCounts,
          },
          {
            label: 'Supervision Population',
            backgroundColor: COLORS['blue-standard-2'],
            hoverBackgroundColor: COLORS['blue-standard-2'],
            yAxisID: 'y-axis-left',
            data: stateSupervisionCounts,
          },
        ],
      }}
      options={{
        responsive: true,
        legend: {
          display: true,
          position: 'bottom',
        },
        tooltips: {
          backgroundColor: COLORS['grey-800-light'],
          mode: 'index',
          callbacks: tooltipForCountChart(ftrReferralCounts, 'Referral', stateSupervisionCounts, 'Supervision'),
        },
        scaleShowValues: true,
        scales: {
          yAxes: [{
            stacked: false,
            ticks: {
              beginAtZero: true,
              min: undefined,
              max: undefined,
            },
            position: 'left',
            id: 'y-axis-left',
            scaleLabel: {
              display: true,
              labelString: 'Count',
            },
          }],
          xAxes: [{
            stacked: false,
            ticks: {
              autoSkip: false,
            },
            scaleLabel: {
              display: true,
              labelString: 'Gender',
            },
          }],
        },
      }}
    />
  );

  const ratesChart = (
    <Bar
      id={chartId}
      data={{
        labels: ['Referrals', 'Supervision Population'],
        datasets: [{
          label: chartLabels[0],
          backgroundColor: COLORS_STACKED_TWO_VALUES_ALT[0],
          hoverBackgroundColor: COLORS_STACKED_TWO_VALUES_ALT[0],
          hoverBorderColor: COLORS_STACKED_TWO_VALUES_ALT[0],
          data: [
            ftrReferralProportions[0],
            stateSupervisionProportions[0],
          ],
        }, {
          label: chartLabels[1],
          backgroundColor: COLORS_STACKED_TWO_VALUES_ALT[1],
          hoverBackgroundColor: COLORS_STACKED_TWO_VALUES_ALT[1],
          hoverBorderColor: COLORS_STACKED_TWO_VALUES_ALT[1],
          data: [
            ftrReferralProportions[1],
            stateSupervisionProportions[1],
          ],
        },
        ],
      }}
      options={{
        scales: {
          xAxes: [{
            stacked: true,
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Percentage',
            },
            stacked: true,
            ticks: {
              min: 0,
              max: 100,
            },
          }],
        },
        responsive: true,
        legend: {
          position: 'bottom',
        },
        tooltips: {
          backgroundColor: COLORS['grey-800-light'],
          mode: 'dataset',
          intersect: true,
          callbacks: tooltipForRateChart(),
        },
      }}
    />
  );

  let activeChart = countsChart;
  if (props.metricType === 'rates') {
    activeChart = ratesChart;
  }

  const exportedStructureCallback = () => (
    {
      metric: 'FTR Referrals by Gender',
      series: [],
    });

  configureDownloadButtons(chartId, 'FTR REFERRALS BY GENDER - 60 DAYS',
    activeChart.props.data.datasets, activeChart.props.data.labels,
    document.getElementById(chartId), exportedStructureCallback);

  return activeChart;
};

export default FtrReferralsByGender;
