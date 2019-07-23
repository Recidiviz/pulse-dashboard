import React, { useState, useEffect } from "react";

import { Pie } from 'react-chartjs-2';
import { COLORS_FIVE_VALUES } from "../../../assets/scripts/constants/colors";
import { useAuth0 } from "../../../react-auth0-spa";

const AdmissionTypeProportions = () => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);
  const { getTokenSilently } = useAuth0();

  const processResponse = (responseData) => {
    const countsByAdmissionType = responseData.admissionCountsByType;

    var sortable = [];
    for (var admissionType in countsByAdmissionType) {
        sortable.push([admissionType, countsByAdmissionType[admissionType]]);
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
      setChartDataPoints(sorted.map(element => element[1]));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  return (
    <Pie data={{
      datasets: [{
        data: chartDataPoints,
        backgroundColor: COLORS_FIVE_VALUES,
        hoverBackgroundColor: COLORS_FIVE_VALUES,
      }],
      labels: chartLabels,
    }}
    options={{
      responsive: true,
      legend: {
        position: 'right',
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            //get the concerned dataset
            var dataset = data.datasets[tooltipItem.datasetIndex];
            //calculate the total of this data set
            var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
              return previousValue + currentValue;
            });
            //get the current items value
            var currentValue = dataset.data[tooltipItem.index];
            //calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
            var percentage = Math.floor(((currentValue/total) * 100)+0.5);

            return data.labels[tooltipItem.index] + ": " + currentValue + ' (' + percentage + '%)';
          }
        }
      },
    }}
    />
  );
}

export default AdmissionTypeProportions;
