import React, { useState, useEffect } from "react";

import { Bar } from 'react-chartjs-2';
import { COLORS_STACKED_TWO_VALUES } from "../../../assets/scripts/constants/colors";

const RevocationCountBySupervisionType = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [paroleDataPoints, setParoleDataPoints] = useState([]);
  const [probationDataPoints, setProbationDataPoints] = useState([]);

  const processResponse = () => {
    const countsByMonth = props.revocationCountsByMonthBySupervisionType;

    var sorted = [];
    for (var month in countsByMonth) {
        sorted.push([month, countsByMonth[month]]);
    }

    setChartLabels(sorted.map(element => element[0]));
    setParoleDataPoints(sorted.map(element => element[1].parole));
    setProbationDataPoints(sorted.map(element => element[1].probation));
  }

  useEffect(() => {
    processResponse();
  }, [props.revocationCountsByMonthBySupervisionType]);

  return (
    <Bar data={{
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
}

export default RevocationCountBySupervisionType;
