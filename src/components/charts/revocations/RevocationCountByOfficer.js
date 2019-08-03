import React, { useState, useEffect } from "react";

import { Bar } from 'react-chartjs-2';
import { COLORS_STACKED_TWO_VALUES } from "../../../assets/scripts/constants/colors";

const RevocationCountByOfficer = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [technicalDataPoints, setTechnicalDataPoints] = useState([]);
  const [nonTechnicalDataPoints, setNonTechnicalDataPoints] = useState([]);

  const processResponse = () => {
    const countsByOfficer = props.revocationCountsByOfficer;

    var sorted = [];
    for (var officer in countsByOfficer) {
        sorted.push([officer, countsByOfficer[officer]]);
    }
    sorted.sort(function(a, b) {
      var aCounts = a[1];
      var bCounts = b[1];
      return (bCounts.technical + bCounts.nonTechnical) - (aCounts.technical + aCounts.nonTechnical);
    });

    setChartLabels(sorted.map(element => element[0]));
    setTechnicalDataPoints(sorted.map(element => element[1].technical));
    setNonTechnicalDataPoints(sorted.map(element => element[1].nonTechnical));
  }

  useEffect(() => {
    processResponse();
  }, [props.revocationCountsByOfficer]);

  return (
    <Bar data={{
      labels: chartLabels,
      datasets: [{
        label: 'Non-Technical',
        backgroundColor: COLORS_STACKED_TWO_VALUES[0],
        borderColor: COLORS_STACKED_TWO_VALUES[0],
        borderWidth: 1,
        data: nonTechnicalDataPoints,
      }, {
        label: 'Technical',
        backgroundColor: COLORS_STACKED_TWO_VALUES[1],
        borderColor: COLORS_STACKED_TWO_VALUES[1],
        borderWidth: 1,
        data: technicalDataPoints,
      }],
    }}
    options={{
      responsive: true,
      legend: {
        position: 'top',
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Officer id',
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

export default RevocationCountByOfficer;
