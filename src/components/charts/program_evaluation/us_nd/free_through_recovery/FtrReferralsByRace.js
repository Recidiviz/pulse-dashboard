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
import { COLORS_FIVE_VALUES, COLORS } from '../../../../../assets/scripts/constants/colors';
import { sortByLabel } from '../../../../../utils/dataOrganizing';
import { configureDownloadButtons } from '../../../../../assets/scripts/utils/downloads';
import { raceValueToHumanReadable, toInt } from '../../../../../utils/variableConversion';

const FtrReferralsByRace = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [ftrReferralProportions, setFtrReferralProportions] = useState([]);
  const [stateSupervisionProportions, setStateSupervisionProportions] = useState([]);
  const [statePopulationProportions, setStatePopulationProportions] = useState([]);
  const [ftrReferralCounts, setFtrReferralCounts] = useState([]);
  const [stateSupervisionCounts, setStateSupervisionCounts] = useState([]);

  const chartId = 'ftrReferralsByRace';

  const processResponse = () => {
    const {
      ftrReferralsByRace,
      supervisionPopulationByRace,
      statePopulationByRace,
    } = props;

    const ftrReferralDataPoints = [];
    if (ftrReferralsByRace) {
      ftrReferralsByRace.forEach((data) => {
        const { race_or_ethnicity: race } = data;
        const count = toInt(data.count, 10);
        ftrReferralDataPoints.push({ race: raceValueToHumanReadable(race), count });
      });
    }

    const supervisionDataPoints = [];
    if (supervisionPopulationByRace) {
      supervisionPopulationByRace.forEach((data) => {
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

    const racesRepresentedFtrReferrals = ftrReferralDataPoints.map((element) => element.race);
    const racesRepresentedSupervision = supervisionDataPoints.map((element) => element.race);

    stateCensusDataPoints.forEach((raceGroup) => {
      const { race } = raceGroup;
      if (!racesRepresentedFtrReferrals.includes(race)) {
        ftrReferralDataPoints.push({ race, count: 0 });
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

    const totalFtrReferrals = totalSum(ftrReferralDataPoints);
    const totalSupervisionPopulation = totalSum(supervisionDataPoints);

    // Sort by race alphabetically
    const sortedFtrReferralsDataPoints = sortByLabel(ftrReferralDataPoints, 'race');
    const sortedSupervisionDataPoints = sortByLabel(supervisionDataPoints, 'race');
    const sortedStateCensusDataPoints = sortByLabel(stateCensusDataPoints, 'race');

    setChartLabels(sortedFtrReferralsDataPoints.map((element) => element.race));
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
    setStatePopulationProportions(sortedStateCensusDataPoints.map(
      (element) => (element.proportion),
    ));
  };

  useEffect(() => {
    processResponse();
  }, [props.ftrReferralsByRace, props.supervisionPopulationByRace]);

  const chart = (
    <HorizontalBar
      id={chartId}
      data={{
        labels: ['Referrals', 'Supervision Population', 'ND Population'],
        datasets: [{
          label: chartLabels[0],
          backgroundColor: COLORS_FIVE_VALUES[0],
          hoverBackgroundColor: COLORS_FIVE_VALUES[0],
          hoverBorderColor: COLORS_FIVE_VALUES[0],
          data: [
            ftrReferralProportions[0],
            stateSupervisionProportions[0],
            statePopulationProportions[0],
          ],
        }, {
          label: chartLabels[1],
          backgroundColor: COLORS_FIVE_VALUES[1],
          hoverBackgroundColor: COLORS_FIVE_VALUES[1],
          hoverBorderColor: COLORS_FIVE_VALUES[1],
          data: [
            ftrReferralProportions[1],
            stateSupervisionProportions[1],
            statePopulationProportions[1],
          ],
        }, {
          label: chartLabels[2],
          backgroundColor: COLORS_FIVE_VALUES[2],
          hoverBackgroundColor: COLORS_FIVE_VALUES[2],
          hoverBorderColor: COLORS_FIVE_VALUES[2],
          data: [
            ftrReferralProportions[2],
            stateSupervisionProportions[2],
            statePopulationProportions[2],
          ],
        }, {
          label: chartLabels[3],
          backgroundColor: COLORS_FIVE_VALUES[3],
          hoverBackgroundColor: COLORS_FIVE_VALUES[3],
          hoverBorderColor: COLORS_FIVE_VALUES[3],
          data: [
            ftrReferralProportions[3],
            stateSupervisionProportions[3],
            statePopulationProportions[3],
          ],
        }, {
          label: chartLabels[4],
          backgroundColor: COLORS_FIVE_VALUES[4],
          hoverBackgroundColor: COLORS_FIVE_VALUES[4],
          hoverBorderColor: COLORS_FIVE_VALUES[4],
          data: [
            ftrReferralProportions[4],
            stateSupervisionProportions[4],
            statePopulationProportions[4],
          ],
        }, {
          label: chartLabels[5],
          backgroundColor: COLORS['blue-standard-2'],
          hoverBackgroundColor: COLORS['blue-standard-2'],
          hoverBorderColor: COLORS['blue-standard-2'],
          data: [
            ftrReferralProportions[5],
            stateSupervisionProportions[5],
            statePopulationProportions[5],
          ],
        }, {
          label: chartLabels[6],
          backgroundColor: COLORS['blue-standard'],
          hoverBackgroundColor: COLORS['blue-standard'],
          hoverBorderColor: COLORS['blue-standard'],
          data: [
            ftrReferralProportions[6],
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
      metric: 'FTR Referrals by Race',
      series: [],
    });

  configureDownloadButtons(chartId, 'FTR REFERRALS BY RACE - 60 DAYS',
    chart.props.data.datasets, chart.props.data.labels,
    document.getElementById(chartId), exportedStructureCallback);

  return chart;
};

export default FtrReferralsByRace;
