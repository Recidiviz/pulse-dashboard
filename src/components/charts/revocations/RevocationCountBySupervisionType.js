import React, { useState, useEffect } from "react";

import { Bar } from 'react-chartjs-2';
import { COLORS_STACKED_TWO_VALUES } from "../../../assets/scripts/constants/colors";
import { monthNamesFromNumberList } from "../../../utils/monthConversion";

const RevocationCountBySupervisionType = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [paroleDataPoints, setParoleDataPoints] = useState([]);
  const [probationDataPoints, setProbationDataPoints] = useState([]);

  const processResponse = () => {
    const countsByMonth = props.revocationCountsByMonthBySupervisionType;

    var sorted_parole = [];
    var sorted_probation = [];
    countsByMonth.forEach(function (data) {
      const year = data.year;
      const month = data.month;
      const count = data.revocation_count;

      if (data.admission_reason === 'PAROLE_REVOCATION') {
        sorted_parole.push([year, month, count]);
      } else {
        sorted_probation.push([year, month, count]);
      }
    });

    const sortFunction = function(a, b) {
        if (a[0] === b[0]) {
          return a[1] - b[1];
        } else {
          return a[0] - b[0];
        }
    };

    // Sort by month and year
    sorted_parole.sort(sortFunction);
    sorted_probation.sort(sortFunction);

    // Just display the most recent 6 months
    sorted_parole = sorted_parole.slice(sorted_parole.length - 6, sorted_parole.length);
    sorted_probation = sorted_probation.slice(sorted_probation.length - 6, sorted_probation.length);

    setChartLabels(sorted_parole.map(element => element[1]));
    setParoleDataPoints(sorted_parole.map(element => element[2]));
    setProbationDataPoints(sorted_probation.map(element => element[2]));
  }

  useEffect(() => {
    processResponse();
  }, [props.revocationCountsByMonthBySupervisionType]);

  return (
    <Bar data={{
      labels: monthNamesFromNumberList(chartLabels),
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
