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
import { COLORS_STACKED_TWO_VALUES_ALT, COLORS } from '../../../../../assets/scripts/constants/colors';
import { sortByLabel } from '../../../../../utils/dataOrganizing';
import { configureDownloadButtons } from '../../../../../assets/scripts/utils/downloads';
import { genderValueToHumanReadable, toInt } from '../../../../../utils/variableConversion';

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

    const ftrReferralDataPoints = [];
    if (ftrReferralsByGender) {
      ftrReferralsByGender.forEach((data) => {
        let { gender } = data;
        gender = genderValueToHumanReadable(gender);
        const count = toInt(data.count, 10);
        ftrReferralDataPoints.push({ gender, count });
      });
    }

    const supervisionDataPoints = [];
    if (supervisionPopulationByGender) {
      supervisionPopulationByGender.forEach((data) => {
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
  ]);

  const chart = (
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
            ticks: {
              min: 0,
              max: 100,
            },
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Percentage',
            },
            stacked: true,
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
          callbacks: {
            title: (tooltipItem, data) => {
              const dataset = data.datasets[tooltipItem[0].datasetIndex];
              return dataset.label;
            },
            label: (tooltipItem, data) => {
              const dataset = data.datasets[tooltipItem.datasetIndex];
              const currentValue = dataset.data[tooltipItem.index];

              let datasetCounts = [];
              if (data.labels[tooltipItem.index] === 'Referrals') {
                datasetCounts = ftrReferralCounts;
              } else if (data.labels[tooltipItem.index] === 'Supervision Population') {
                datasetCounts = stateSupervisionCounts;
              } else {
                return ''.concat(currentValue.toFixed(2), '% of ',
                  data.labels[tooltipItem.index]);
              }

              return ''.concat(currentValue.toFixed(2), '% of ',
                data.labels[tooltipItem.index], ' (', datasetCounts[tooltipItem.datasetIndex], ')');
            },
          },
        },
      }}
    />
  );

  const exportedStructureCallback = () => (
    {
      metric: 'FTR Referrals by Gender',
      series: [],
    });

  configureDownloadButtons(chartId, chart.props.data.datasets,
    chart.props.data.labels, document.getElementById(chartId),
    exportedStructureCallback);

  return chart;
};

export default FtrReferralsByGender;
