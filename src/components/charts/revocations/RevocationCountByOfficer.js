import React, { useState, useEffect } from "react";

import { Bar } from 'react-chartjs-2';
import { COLORS_STACKED_TWO_VALUES } from "../../../assets/scripts/constants/colors";
import { useAuth0 } from "../../../react-auth0-spa";

const RevocationCountByOfficer = () => {
  const [chartLabels, setChartLabels] = useState([]);
  const [technicalDataPoints, setTechnicalDataPoints] = useState([]);
  const [nonTechnicalDataPoints, setNonTechnicalDataPoints] = useState([]);
  const { getTokenSilently } = useAuth0();

  const processResponse = (responseData) => {
    const countsByOfficer = responseData.revocationCountsByOfficer;

    var sortable = [];
    for (var officer in countsByOfficer) {
        sortable.push([officer, countsByOfficer[officer]]);
    }
    sortable.sort(function(a, b) {
      var aCounts = a[1];
      var bCounts = b[1];
      return (bCounts.technical + bCounts.nonTechnical) - (aCounts.technical + aCounts.nonTechnical);
    });

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
      setTechnicalDataPoints(sorted.map(element => element[1].technical));
      setNonTechnicalDataPoints(sorted.map(element => element[1].nonTechnical));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

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
