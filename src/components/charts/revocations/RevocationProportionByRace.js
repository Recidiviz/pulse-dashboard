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

import { HorizontalBar } from 'react-chartjs-2';
import { COLORS_FIVE_VALUES, COLORS } from '../../../assets/scripts/constants/colors';
import { sortByLabel } from '../../../utils/dataOrganizing';
import { configureDownloadButtons } from '../../../assets/scripts/utils/downloads';

const labelStringConversion = {
  AMERICAN_INDIAN_ALASKAN_NATIVE: 'American Indian Alaskan Native',
  ASIAN: 'Asian',
  BLACK: 'Black',
  HISPANIC: 'Hispanic',
  NATIVE_HAWAIIAN_PACIFIC_ISLANDER: 'Native Hawaiian Pacific Islander',
  WHITE: 'White',
  OTHER: 'Other',
};

const ND_RACE_PROPORTIONS = {
  'American Indian Alaskan Native': 5.5,
  Asian: 1.8,
  Black: 3.4,
  Hispanic: 3.9,
  'Native Hawaiian Pacific Islander': 0.1,
  White: 84.0,
  Other: 1.3,
};

const RevocationProportionByRace = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [revocationProportions, setRevocationProportions] = useState([]);
  const [statePopulationProportions, setStatePopulationProportions] = useState([]);
  const [stateSupervisionProportions, setStateSupervisionProportions] = useState([]);
  const [revocationCounts, setRevocationCounts] = useState([]);
  const [stateSupervisionCounts, setStateSupervisionCounts] = useState([]);

  const processResponse = () => {
    const { revocationProportionByRace } = props;
    const { supervisionPopulationByRace } = props;

    const revocationDataPoints = [];
    revocationProportionByRace.forEach((data) => {
      const { race_or_ethnicity: race } = data;
      const count = parseInt(data.revocation_count, 10);
      revocationDataPoints.push({ race: labelStringConversion[race], count });
    });

    const supervisionDataPoints = [];
    supervisionPopulationByRace.forEach((data) => {
      const { race_or_ethnicity: race } = data;
      const count = parseInt(data.count, 10);
      supervisionDataPoints.push({ race: labelStringConversion[race], count });
    });

    const racesRepresentedRevocations = revocationDataPoints.map((element) => element.race);
    const racesRepresentedSupervision = supervisionDataPoints.map((element) => element.race);

    Object.values(labelStringConversion).forEach((race) => {
      if (!racesRepresentedRevocations.includes(race)) {
        revocationDataPoints.push({ race, count: 0 });
      }

      if (!racesRepresentedSupervision.includes(race)) {
        supervisionDataPoints.push({ race, count: 0 });
      }
    });

    function totalSum(dataPoints) {
      return dataPoints.map((element) => element.count).reduce(
        (previousValue, currentValue) => (previousValue + currentValue),
      );
    }

    const totalRevocations = totalSum(revocationDataPoints);
    const totalSupervisionPopulation = totalSum(supervisionDataPoints);

    // Sort by race alphabetically
    const sortedRevocationDataPoints = sortByLabel(revocationDataPoints, 'race');
    const sortedSupervisionDataPoints = sortByLabel(supervisionDataPoints, 'race');

    setChartLabels(sortedRevocationDataPoints.map((element) => element.race));
    setRevocationProportions(sortedRevocationDataPoints.map(
      (element) => (100 * (element.count / totalRevocations)),
    ));
    setRevocationCounts(sortedRevocationDataPoints.map(
      (element) => (element.count),
    ));
    setStateSupervisionProportions(sortedSupervisionDataPoints.map(
      (element) => (100 * (element.count / totalSupervisionPopulation)),
    ));
    setStateSupervisionCounts(sortedSupervisionDataPoints.map(
      (element) => (element.count),
    ));
    setStatePopulationProportions(sortedRevocationDataPoints.map(
      (element) => ND_RACE_PROPORTIONS[element.race],
    ));
  };

  useEffect(() => {
    processResponse();
  }, [props.revocationProportionByRace, props.supervisionPopulationByRace]);

  const chart = (
    <HorizontalBar
      id="revocationsByRace"
      data={{
        labels: ['Revocations', 'Supervision Population', 'ND Population'],
        datasets: [{
          label: chartLabels[0],
          backgroundColor: COLORS_FIVE_VALUES[0],
          data: [
            revocationProportions[0], stateSupervisionProportions[0], statePopulationProportions[0],
          ],
        }, {
          label: chartLabels[1],
          backgroundColor: COLORS_FIVE_VALUES[1],
          data: [
            revocationProportions[1], stateSupervisionProportions[1], statePopulationProportions[1],
          ],
        }, {
          label: chartLabels[2],
          backgroundColor: COLORS_FIVE_VALUES[2],
          data: [
            revocationProportions[2], stateSupervisionProportions[2], statePopulationProportions[2],
          ],
        }, {
          label: chartLabels[3],
          backgroundColor: COLORS_FIVE_VALUES[3],
          data: [
            revocationProportions[3], stateSupervisionProportions[3], statePopulationProportions[3],
          ],
        }, {
          label: chartLabels[4],
          backgroundColor: COLORS_FIVE_VALUES[4],
          data: [
            revocationProportions[4], stateSupervisionProportions[4], statePopulationProportions[4],
          ],
        }, {
          label: chartLabels[5],
          backgroundColor: COLORS['blue-standard-2'],
          data: [
            revocationProportions[5], stateSupervisionProportions[5], statePopulationProportions[5],
          ],
        }, {
          label: chartLabels[6],
          backgroundColor: COLORS['blue-standard'],
          data: [
            revocationProportions[6], stateSupervisionProportions[6], statePopulationProportions[6],
          ],
        },
        ],
      }}
      options={{
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Percentage',
            },
            stacked: true,
          }],
          yAxes: [{
            stacked: true,
          }],
        },
        responsive: true,
        legend: {
          position: 'bottom',
        },
        tooltips: {
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
              if (data.labels[tooltipItem.index] === 'Revocations') {
                datasetCounts = revocationCounts;
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
      metric: 'Revocations by race',
      series: [],
    });

  configureDownloadButtons('revocationsByRace', chart.props.data.datasets,
    chart.props.data.labels, document.getElementById('revocationsByRace'),
    exportedStructureCallback);

  return chart;
};

export default RevocationProportionByRace;
