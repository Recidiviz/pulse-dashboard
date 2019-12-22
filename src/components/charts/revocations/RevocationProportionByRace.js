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
import { Bar, HorizontalBar } from 'react-chartjs-2';

import { COLORS_FIVE_VALUES, COLORS } from '../../../assets/scripts/constants/colors';
import { configureDownloadButtons } from '../../../assets/scripts/utils/downloads';
import {
  filterDatasetBySupervisionType, filterDatasetByDistrict, filterDatasetByTimeWindow,
} from '../../../utils/charts/toggles';
import { sortByLabel } from '../../../utils/transforms/datasets';
import { raceValueToHumanReadable, toInt } from '../../../utils/transforms/labels';

const RevocationProportionByRace = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [revocationProportions, setRevocationProportions] = useState([]);
  const [statePopulationProportions, setStatePopulationProportions] = useState([]);
  const [stateSupervisionProportions, setStateSupervisionProportions] = useState([]);
  const [revocationCounts, setRevocationCounts] = useState([]);
  const [stateSupervisionCounts, setStateSupervisionCounts] = useState([]);

  const chartId = 'revocationsByRace';

  const processResponse = () => {
    const {
      revocationProportionByRace,
      supervisionPopulationByRace,
      statePopulationByRace,
    } = props;

    let filteredRevocationProportions = filterDatasetBySupervisionType(
      revocationProportionByRace, props.supervisionType,
      ['state_code', 'time_window', 'race_or_ethnicity', 'district'],
      ['revocation_count'],
    );

    filteredRevocationProportions = filterDatasetByDistrict(
      filteredRevocationProportions, props.district,
      ['state_code', 'time_window', 'race_or_ethnicity'],
      ['revocation_count'],
    );

    let filteredSupervisionPopulation = filterDatasetBySupervisionType(
      supervisionPopulationByRace, props.supervisionType,
      ['state_code', 'time_window', 'race_or_ethnicity', 'district'],
      ['count'],
    );

    filteredSupervisionPopulation = filterDatasetByDistrict(
      filteredSupervisionPopulation, props.district,
      ['state_code', 'time_window', 'race_or_ethnicity'],
      ['count'],
    );

    const revocationProportionByRaceAndTime = filterDatasetByTimeWindow(
      filteredRevocationProportions, props.timeWindow,
    );

    const supervisionPopulationByRaceAndTime = filterDatasetByTimeWindow(
      filteredSupervisionPopulation, props.timeWindow,
    );

    const revocationDataPoints = [];
    if (revocationProportionByRaceAndTime) {
      revocationProportionByRaceAndTime.forEach((data) => {
        const { race_or_ethnicity: race } = data;
        const count = toInt(data.revocation_count, 10);
        revocationDataPoints.push({ race: raceValueToHumanReadable(race), count });
      });
    }

    const supervisionDataPoints = [];
    if (supervisionPopulationByRaceAndTime) {
      supervisionPopulationByRaceAndTime.forEach((data) => {
        const { race_or_ethnicity: race } = data;
        const count = toInt(data.count);
        supervisionDataPoints.push({ race: raceValueToHumanReadable(race), count });
      });
    }

    const stateCensusDataPoints = [];
    if (statePopulationByRace) {
      statePopulationByRace.forEach((data) => {
        const { race_or_ethnicity: race } = data;
        const proportion = Number(data.proportion);
        stateCensusDataPoints.push({ race: raceValueToHumanReadable(race), proportion });
      });
    }

    const racesRepresentedRevocations = revocationDataPoints.map((element) => element.race);
    const racesRepresentedSupervision = supervisionDataPoints.map((element) => element.race);

    stateCensusDataPoints.forEach((raceGroup) => {
      const { race } = raceGroup;
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
    const sortedStateCensusDataPoints = sortByLabel(stateCensusDataPoints, 'race');

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
    setStatePopulationProportions(sortedStateCensusDataPoints.map(
      (element) => (element.proportion),
    ));
  };

  useEffect(() => {
    processResponse();
  }, [
    props.revocationProportionByRace,
    props.supervisionPopulationByRace,
    props.metricType,
    props.timeWindow,
    props.supervisionType,
    props.district,
  ]);

  const ratesChart = (
    <HorizontalBar
      id={chartId}
      data={{
        labels: ['Revocations', 'Supervision Population', 'ND Population'],
        datasets: [{
          label: chartLabels[0],
          backgroundColor: COLORS_FIVE_VALUES[0],
          hoverBackgroundColor: COLORS_FIVE_VALUES[0],
          hoverBorderColor: COLORS_FIVE_VALUES[0],
          data: [
            revocationProportions[0],
            stateSupervisionProportions[0],
            statePopulationProportions[0],
          ],
        }, {
          label: chartLabels[1],
          backgroundColor: COLORS_FIVE_VALUES[1],
          hoverBackgroundColor: COLORS_FIVE_VALUES[1],
          hoverBorderColor: COLORS_FIVE_VALUES[1],
          data: [
            revocationProportions[1],
            stateSupervisionProportions[1],
            statePopulationProportions[1],
          ],
        }, {
          label: chartLabels[2],
          backgroundColor: COLORS_FIVE_VALUES[2],
          hoverBackgroundColor: COLORS_FIVE_VALUES[2],
          hoverBorderColor: COLORS_FIVE_VALUES[2],
          data: [
            revocationProportions[2],
            stateSupervisionProportions[2],
            statePopulationProportions[2],
          ],
        }, {
          label: chartLabels[3],
          backgroundColor: COLORS_FIVE_VALUES[3],
          hoverBackgroundColor: COLORS_FIVE_VALUES[3],
          hoverBorderColor: COLORS_FIVE_VALUES[3],
          data: [
            revocationProportions[3],
            stateSupervisionProportions[3],
            statePopulationProportions[3],
          ],
        }, {
          label: chartLabels[4],
          backgroundColor: COLORS_FIVE_VALUES[4],
          hoverBackgroundColor: COLORS_FIVE_VALUES[4],
          hoverBorderColor: COLORS_FIVE_VALUES[4],
          data: [
            revocationProportions[4],
            stateSupervisionProportions[4],
            statePopulationProportions[4],
          ],
        }, {
          label: chartLabels[5],
          backgroundColor: COLORS['blue-standard-2'],
          hoverBackgroundColor: COLORS['blue-standard-2'],
          hoverBorderColor: COLORS['blue-standard-2'],
          data: [
            revocationProportions[5],
            stateSupervisionProportions[5],
            statePopulationProportions[5],
          ],
        }, {
          label: chartLabels[6],
          backgroundColor: COLORS['blue-standard'],
          hoverBackgroundColor: COLORS['blue-standard'],
          hoverBorderColor: COLORS['blue-standard'],
          data: [
            revocationProportions[6],
            stateSupervisionProportions[6],
            statePopulationProportions[6],
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
            ticks: {
              min: 0,
              max: 100,
            },
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

  const countsChart = (
    <Bar
      id={chartId}
      data={{
        labels: ['Revocation Counts', 'Supervision Population'],
        datasets: [{
          label: chartLabels[0],
          backgroundColor: COLORS_FIVE_VALUES[0],
          hoverBackgroundColor: COLORS_FIVE_VALUES[0],
          hoverBorderColor: COLORS_FIVE_VALUES[0],
          data: [
            revocationCounts[0],
            stateSupervisionCounts[0],
          ],
        }, {
          label: chartLabels[1],
          backgroundColor: COLORS_FIVE_VALUES[1],
          hoverBackgroundColor: COLORS_FIVE_VALUES[1],
          hoverBorderColor: COLORS_FIVE_VALUES[1],
          data: [
            revocationCounts[1],
            stateSupervisionCounts[1],
          ],
        }, {
          label: chartLabels[2],
          backgroundColor: COLORS_FIVE_VALUES[2],
          hoverBackgroundColor: COLORS_FIVE_VALUES[2],
          hoverBorderColor: COLORS_FIVE_VALUES[2],
          data: [
            revocationCounts[2],
            stateSupervisionCounts[2],
          ],
        }, {
          label: chartLabels[3],
          backgroundColor: COLORS_FIVE_VALUES[3],
          hoverBackgroundColor: COLORS_FIVE_VALUES[3],
          hoverBorderColor: COLORS_FIVE_VALUES[3],
          data: [
            revocationCounts[3],
            stateSupervisionCounts[3],
          ],
        }, {
          label: chartLabels[4],
          backgroundColor: COLORS_FIVE_VALUES[4],
          hoverBackgroundColor: COLORS_FIVE_VALUES[4],
          hoverBorderColor: COLORS_FIVE_VALUES[4],
          data: [
            revocationCounts[4],
            stateSupervisionCounts[4],
          ],
        }, {
          label: chartLabels[5],
          backgroundColor: COLORS['blue-standard-2'],
          hoverBackgroundColor: COLORS['blue-standard-2'],
          hoverBorderColor: COLORS['blue-standard-2'],
          data: [
            revocationCounts[5],
            stateSupervisionCounts[5],
          ],
        }, {
          label: chartLabels[6],
          backgroundColor: COLORS['blue-standard'],
          hoverBackgroundColor: COLORS['blue-standard'],
          hoverBorderColor: COLORS['blue-standard'],
          data: [
            revocationCounts[6],
            stateSupervisionCounts[6],
          ],
        },
        ],
      }}
      options={{
        responsive: true,
        legend: {
          position: 'bottom',
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          xAxes: [{
            ticks: {
              autoSkip: false,
            },
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Revocation counts',
            },
          }],
        },
      }}
    />
  );

  const exportedStructureCallback = () => (
    {
      metric: 'Revocations by race',
      series: [],
    });

  let activeChart = countsChart;
  if (props.metricType === 'rates') {
    activeChart = ratesChart;
  }

  configureDownloadButtons(chartId, 'REVOCATIONS BY RACE - 60 DAYS',
    activeChart.props.data.datasets, activeChart.props.data.labels,
    document.getElementById('revocationsByRace'), exportedStructureCallback);

  return activeChart;
};

export default RevocationProportionByRace;
