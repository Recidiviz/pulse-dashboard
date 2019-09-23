import React, { useState, useEffect } from 'react';

import { HorizontalBar } from 'react-chartjs-2';
import { COLORS_FIVE_VALUES, COLORS } from '../../../assets/scripts/constants/colors';
import { sortByLabel } from '../../../utils/dataOrganizing';

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
  'Asian': 1.8,
  'Black': 3.4,
  'Hispanic': 3.9,
  'Native Hawaiian Pacific Islander': 0.1,
  'White': 84.0,
  'Other': 1.3,
};

const RevocationProportionByRace = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartProportions, setChartProportions] = useState([]);
  const [statePopulationProportions, setStateProportions] = useState([]);

  const processResponse = () => {
    const { revocationProportionByRace: proportionsByRace } = props;

    const dataPoints = [];
    proportionsByRace.forEach((data) => {
      const { race_or_ethnicity: race } = data;
      const count = parseInt(data.revocation_count, 10);
      dataPoints.push([labelStringConversion[race], count]);
    });

    const racesRepresented = dataPoints.map((element) => element[0]);

    Object.values(labelStringConversion).forEach((race) => {
      if (!racesRepresented.includes(race)) {
        dataPoints.push([race, 0]);
      }
    });

    const total = dataPoints.map((element) => element[1]).reduce(
      (previousValue, currentValue) => (previousValue + currentValue),
    );

    // Sort by race alphabetically
    const sorted = sortByLabel(dataPoints, 0);

    setChartLabels(sorted.map((element) => element[0]));
    setChartProportions(sorted.map((element) => (100 * (element[1] / total))));
    setStateProportions(sorted.map((element) => ND_RACE_PROPORTIONS[element[0]]));
  };

  useEffect(() => {
    processResponse();
  }, [props.revocationProportionByRace]);

  return (
    <HorizontalBar
      data={{
        labels: ['Revocations', 'ND Population'],
        datasets: [{
          label: chartLabels[0],
          backgroundColor: COLORS_FIVE_VALUES[0],
          data: [chartProportions[0], statePopulationProportions[0]],
        }, {
          label: chartLabels[1],
          backgroundColor: COLORS_FIVE_VALUES[1],
          data: [chartProportions[1], statePopulationProportions[1]],
        }, {
          label: chartLabels[2],
          backgroundColor: COLORS_FIVE_VALUES[2],
          data: [chartProportions[2], statePopulationProportions[2]],
        }, {
          label: chartLabels[3],
          backgroundColor: COLORS_FIVE_VALUES[3],
          data: [chartProportions[3], statePopulationProportions[3]],
        }, {
          label: chartLabels[4],
          backgroundColor: COLORS_FIVE_VALUES[4],
          data: [chartProportions[4], statePopulationProportions[4]],
        }, {
          label: chartLabels[5],
          backgroundColor: COLORS['blue-standard-2'],
          data: [chartProportions[5], statePopulationProportions[5]],
        }, {
          label: chartLabels[6],
          backgroundColor: COLORS['blue-standard'],
          data: [chartProportions[6], statePopulationProportions[6]],
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
            label: (tooltipItem, data) => {
              const dataset = data.datasets[tooltipItem.datasetIndex];
              const currentValue = dataset.data[tooltipItem.index];

              return dataset.label.concat(': ', currentValue.toFixed(2), '% of ', data.labels[tooltipItem.index]);
            },
          },
        },
      }}
    />
  );
};

export default RevocationProportionByRace;
