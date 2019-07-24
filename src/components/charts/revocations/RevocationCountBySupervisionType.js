import React, { useState, useEffect } from "react";

import { Bar } from 'react-chartjs-2';
import { COLORS_STACKED_TWO_VALUES } from "../../../assets/scripts/constants/colors";
import { useAuth0 } from "../../../react-auth0-spa";

const RevocationCountBySupervisionType = () => {
  const [chartLabels, setChartLabels] = useState([]);
  const [paroleDataPoints, setParoleDataPoints] = useState([]);
  const [probationDataPoints, setProbationDataPoints] = useState([]);
  const { getTokenSilently } = useAuth0();

  const processResponse = (responseData) => {
    const countsByMonth = responseData.revocationCountsByMonthBySupervisionType;

    var byMonth = [];
    for (var month in countsByMonth) {
        byMonth.push([month, countsByMonth[month]]);
    }

    return byMonth;
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
      setParoleDataPoints(sorted.map(element => element[1].parole));
      setProbationDataPoints(sorted.map(element => element[1].probation));
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
