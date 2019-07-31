import React, { useState, useEffect } from "react";

import { HorizontalBar } from 'react-chartjs-2';
import { COLORS_FIVE_VALUES, COLORS } from "../../../assets/scripts/constants/colors";

const ND_RACE_PROPORTIONS = {
  'American Indian Alaskan Native': 5.4,
  'Asian': 1,
  'Black': 1.2,
  'White': 90,
  'Other': 2.3,
}

const RevocationProportionByRace = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartProportions, setChartProportions] = useState([]);
  const [statePopulationProportions, setStateProportions] = useState([]);

  const processResponse = () => {
    const proportionsByRace = props.revocationProportionByRace;

    var sorted = [];
    for (var race in proportionsByRace) {
        sorted.push([race, proportionsByRace[race]]);
    }

    setChartLabels(sorted.map(element => element[0]));
    setChartProportions(sorted.map(element => element[1]));
    setStateProportions(sorted.map(element => ND_RACE_PROPORTIONS[element[0]]));
  }

  useEffect(() => {
    processResponse();
  }, [props.revocationProportionByRace]);

  return (
    <HorizontalBar data={{
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
          backgroundColor: COLORS['blue-standard'],
          data: [chartProportions[5], statePopulationProportions[5]],
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
              stacked: true
          }],
          yAxes: [{
              stacked: true
          }]
      },
      responsive: true,
      legend: {
        position: 'bottom',
      },
      tooltips: {
        mode: 'dataset',
        intersect: true,
        callbacks: {
          label: function(tooltipItem, data) {
            //get the concerned dataset
            var dataset = data.datasets[tooltipItem.datasetIndex];
            //get the current items value
            var currentValue = dataset.data[tooltipItem.index];

            return dataset.label + ": " + currentValue + '% of ' + data.labels[tooltipItem.index];
          },
        },
      },
    }}
    />
  );
}

export default RevocationProportionByRace;
