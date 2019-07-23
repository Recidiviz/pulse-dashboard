import React, { useState, useEffect } from "react";

import { HorizontalBar } from 'react-chartjs-2';
import { COLORS_FIVE_VALUES, COLORS } from "../../../assets/scripts/constants/colors";
import { useAuth0 } from "../../../react-auth0-spa";

const ND_RACE_PROPORTIONS = {
  'American Indian Alaskan Native': 5.4,
  'Asian': 1,
  'Black': 1.2,
  'White': 90,
  'Other': 2.3,
}

const RevocationProportionByRace = () => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartProportions, setChartProportions] = useState([]);
  const [statePopulationProportions, setStateProportions] = useState([]);
  const { getTokenSilently } = useAuth0();

  const processResponse = (responseData) => {
    const proportionsByRace = responseData.revocationProportionByRace;

    var sortable = [];
    for (var race in proportionsByRace) {
        sortable.push([race, proportionsByRace[race]]);
    }

    return sortable;
  }

  const fetchChartData = async () => {
    try {
      const token = await getTokenSilently();
      // Likely needs to point to app engine URL
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/external`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const responseData = await response.json();
      const sorted = processResponse(responseData);

      setChartLabels(sorted.map(element => element[0]));
      setChartProportions(sorted.map(element => element[1]));
      setStateProportions(sorted.map(element => ND_RACE_PROPORTIONS[element[0]]));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

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
