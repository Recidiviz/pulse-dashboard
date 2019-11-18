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

import { COLORS } from '../../../../../assets/scripts/constants/colors';
import { configureDownloadButtons } from '../../../../../assets/scripts/utils/downloads';
import { toInt } from '../../../../../utils/transforms/labels';

const FtrReferralsByAge = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [ftrReferralProportions, setFtrReferralProportions] = useState([]);
  const [stateSupervisionProportions, setStateSupervisionProportions] = useState([]);
  const [ftrReferralCounts, setFtrReferralCounts] = useState([]);
  const [stateSupervisionCounts, setStateSupervisionCounts] = useState([]);

  const chartId = 'ftrReferralsByAge';

  const processResponse = () => {
    const { ftrReferralsByAge } = props;
    const { supervisionPopulationByAge } = props;

    const ageBucketLabels = ['Under 25', '25-29', '30-34', '35-39', '40 and over'];

    let totalFtrReferrals = 0;
    const ftrReferralDataPoints = {};
    if (ftrReferralsByAge) {
      ftrReferralsByAge.forEach((data) => {
        let { age_bucket: age } = data;

        if (age === '0-24') {
          age = 'Under 25';
        } else if (age === '40+') {
          age = '40 and over';
        }

        const count = toInt(data.count, 10);
        ftrReferralDataPoints[age] = count;
        totalFtrReferrals += count;
      });
    }

    let totalSupervisionPopulation = 0;
    const supervisionDataPoints = {};
    if (supervisionPopulationByAge) {
      supervisionPopulationByAge.forEach((data) => {
        let { age_bucket: age } = data;

        if (age === '0-24') {
          age = 'Under 25';
        } else if (age === '40+') {
          age = '40 and over';
        }

        const count = toInt(data.count);
        supervisionDataPoints[age] = count;
        totalSupervisionPopulation += count;
      });
    }

    const referralsByAgeCounts = [];
    const referralsByAgeProportions = [];
    const supervisionByAgeCounts = [];
    const supervisionByAgeProportions = [];
    for (let i = 0; i < ageBucketLabels.length; i += 1) {
      const referralValue = ftrReferralDataPoints[ageBucketLabels[i]];
      if (!referralValue || !totalFtrReferrals) {
        referralsByAgeCounts.push(0);
        referralsByAgeProportions.push(0);
      } else {
        referralsByAgeCounts.push(referralValue);
        referralsByAgeProportions.push(100 * (referralValue / totalFtrReferrals));
      }

      const supervisionValue = supervisionDataPoints[ageBucketLabels[i]];
      if (!supervisionValue || !totalSupervisionPopulation) {
        supervisionByAgeCounts.push(0);
        supervisionByAgeProportions.push(0);
      } else {
        supervisionByAgeCounts.push(supervisionValue);
        supervisionByAgeProportions.push(100 * (supervisionValue / totalSupervisionPopulation));
      }
    }

    setChartLabels(ageBucketLabels);
    setFtrReferralCounts(referralsByAgeCounts);
    setFtrReferralProportions(referralsByAgeProportions);
    setStateSupervisionCounts(supervisionByAgeCounts);
    setStateSupervisionProportions(supervisionByAgeProportions);
  };

  useEffect(() => {
    processResponse();
  }, [
    props.ftrReferralsByAge,
    props.supervisionPopulationByAge,
  ]);

  const chart = (
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
            data: ftrReferralProportions,
          },
          {
            label: 'Supervision Population',
            backgroundColor: COLORS['blue-standard-2'],
            hoverBackgroundColor: COLORS['blue-standard-2'],
            yAxisID: 'y-axis-left',
            data: stateSupervisionProportions,
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
          callbacks: {
            label(tooltipItems, data) {
              const { index } = tooltipItems;

              const datasetLabel = data.datasets[tooltipItems.datasetIndex].label;
              let countValue = [];
              if (datasetLabel === 'Referrals') {
                countValue = ftrReferralCounts[index];
              } else if (datasetLabel === 'Supervision Population') {
                countValue = stateSupervisionCounts[index];
              } else {
                countValue = 0;
              }

              return ''.concat(((data.datasets[tooltipItems.datasetIndex].data[index]).toFixed(2)), '% of ',
                data.datasets[tooltipItems.datasetIndex].label, ' (', countValue, ')');
            },
          },
        },
        scaleShowValues: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
            position: 'left',
            id: 'y-axis-left',
            scaleLabel: {
              display: true,
              labelString: 'Percentage',
            },
          }],
          xAxes: [{
            ticks: {
              autoSkip: false,
            },
            scaleLabel: {
              display: true,
              labelString: 'Age',
            },
          }],
        },
      }}
    />
  );

  const exportedStructureCallback = () => (
    {
      metric: 'FTR Referrals by Age',
      series: [],
    });

  configureDownloadButtons(chartId, 'FTR REFERRALS BY AGE - 60 DAYS',
    chart.props.data.datasets, chart.props.data.labels,
    document.getElementById(chartId), exportedStructureCallback);

  return chart;
};

export default FtrReferralsByAge;
