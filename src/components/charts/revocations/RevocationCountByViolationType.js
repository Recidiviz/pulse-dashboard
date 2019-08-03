import React, { useState, useEffect } from "react";

import { Bar } from 'react-chartjs-2';
import { COLORS_FIVE_VALUES } from "../../../assets/scripts/constants/colors";

const RevocationCountByViolationType = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [absconsionDataPoints, setAbsconsionDataPoints] = useState([]);
  const [newOffenseDataPoints, setNewOffenseDataPoints] = useState([]);
  const [technicalDataPoints, setTechnicalDataPoints] = useState([]);

  const processResponse = () => {
    const countsByMonth = props.revocationCountsByMonthByViolationType;

    var sorted = [];
    for (var month in countsByMonth) {
        sorted.push([month, countsByMonth[month]]);
    }

    setChartLabels(sorted.map(element => element[0]));
    setAbsconsionDataPoints(sorted.map(element => element[1].absconsion));
    setNewOffenseDataPoints(sorted.map(element => element[1].newOffense));
    setTechnicalDataPoints(sorted.map(element => element[1].technical));
  }

  useEffect(() => {
    processResponse();
  }, [props.revocationCountsByMonthByViolationType]);

  return (
    <Bar data={{
      labels: chartLabels,
      datasets: [{
          label: "Absconsion",
          backgroundColor: COLORS_FIVE_VALUES[1],
          data: absconsionDataPoints,
        }, {
          label: "New Offense",
          backgroundColor: COLORS_FIVE_VALUES[2],
          data: newOffenseDataPoints,
        }, {
          label: "Technical",
          backgroundColor: COLORS_FIVE_VALUES[4],
          data: technicalDataPoints,
        },
      ],
    }}
    options={{
      responsive: true,
      legend: {
        position: 'bottom',
        boxWidth: 10,
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

export default RevocationCountByViolationType;
