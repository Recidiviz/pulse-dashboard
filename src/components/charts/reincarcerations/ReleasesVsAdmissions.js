import React, { useState, useEffect } from "react";

import { Bar } from 'react-chartjs-2';
import { COLORS_GOOD_BAD } from "../../../assets/scripts/constants/colors";
import { useAuth0 } from "../../../react-auth0-spa";

const ReleasesVsAdmissions = () => {
  const [apiMessage, setApiMessage] = useState([]);
  const { getTokenSilently } = useAuth0();

  const processResponse = (responseData) => {
    const admissions = responseData.admissions;
    const releases = responseData.releases;

    const deltas = [];

    var i;
    for (i = 0; i < admissions.length; i += 1) {
      deltas[i] = admissions[i] - releases[i];
    }
    return deltas;
  }

  const fetchChartData = async () => {
    try {
      const token = await getTokenSilently();

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/external`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const responseData = await response.json();
      const deltas = processResponse(responseData);

      setApiMessage(deltas);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  return (
    <Bar data={{
      labels: ['November', 'December', 'January', 'February', 'March', 'April'],
      datasets: [{
        label: 'Admissions versus releases',
        backgroundColor: function(context) {
          if (context.dataset.data[context.dataIndex] > 0) {
            return COLORS_GOOD_BAD['bad'];
          } else {
            return COLORS_GOOD_BAD['good']; }
          },
        fill: false,
        borderWidth: 2,
        data: apiMessage,
      }],
    }}
    options={{
      legend: {
        display: false,
        position: 'right',
        labels: {
          usePointStyle: true,
          boxWidth: 20,
        },
      },
      tooltips: {
        mode: 'x',
      },
      scales: {
        xAxes: [{
          ticks: {
            autoSkip: false,
          },
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Counts',
          },
        }],
      },
    }}
    />
  );
}

export default ReleasesVsAdmissions;
