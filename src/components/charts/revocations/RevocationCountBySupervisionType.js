import React, { useState, useEffect } from "react";

import { Bar } from 'react-chartjs-2';
import { COLORS_STACKED_TWO_VALUES } from "../../../assets/scripts/constants/colors";
import { monthNamesFromNumbers } from "../../../utils/monthConversion";

const RevocationCountBySupervisionType = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [paroleDataPoints, setParoleDataPoints] = useState([]);
  const [probationDataPoints, setProbationDataPoints] = useState([]);

  const processResponse = () => {
    const { revocationCountsByMonthBySupervisionType: countsByMonth } = props;

    let sortedParole = [];
    let sortedProbation = [];
    countsByMonth.forEach((data) => {
      const { year } = data;
      const { month } = data;
      const { parole_count: paroleCount } = data;
      const { probation_count: probationCount } = data;

      sortedParole.push([year, month, paroleCount]);
      sortedProbation.push([year, month, probationCount]);
    });

    // Sorts by month and year
    const sortFunction = (a, b) => ((a[0] === b[0]) ? (a[1] - b[1]) : (a[0] - b[0]));
    sortedParole.sort(sortFunction);
    sortedProbation.sort(sortFunction);

    // Just display the most recent 6 months
    sortedParole = sortedParole.slice(sortedParole.length - 6, sortedParole.length);
    sortedProbation = sortedProbation.slice(sortedProbation.length - 6, sortedProbation.length);

    setChartLabels(monthNamesFromNumbers(sortedParole.map((element) => element[1])));
    setParoleDataPoints(sortedParole.map((element) => element[2]));
    setProbationDataPoints(sortedProbation.map((element) => element[2]));
  };

  useEffect(() => {
    processResponse();
  }, [props.revocationCountsByMonthBySupervisionType]);

  return (
    <Bar
      data={{
        labels: chartLabels,
        datasets: [{
          label: 'Probation',
          type: 'bar',
          backgroundColor: COLORS_STACKED_TWO_VALUES[0],
          data: probationDataPoints,
        }, {
          label: 'Parole',
          type: 'bar',
          backgroundColor: COLORS_STACKED_TWO_VALUES[1],
          data: paroleDataPoints,
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
            scaleLabel: {
              display: true,
              labelString: 'Month',
            },
            stacked: true,
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Revocation counts',
            },
            stacked: true,
          }],
        },
      }}
    />
  );
};

export default RevocationCountBySupervisionType;
