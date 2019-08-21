import React, { useState, useEffect } from "react";

import { Pie } from 'react-chartjs-2';
import { COLORS_FIVE_VALUES } from "../../../assets/scripts/constants/colors";

const AdmissionTypeProportions = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  const processResponse = () => {
    const countsByAdmissionType = props.admissionCountsByType;

    const labelStringConversion = {
      'UNKNOWN_REVOCATION': 'Revocations (Type Unknown)',
      'NEW_ADMISSION': 'New Admissions',
      'NON_TECHNICAL': 'Non-Technical Revocations',
      'TECHNICAL': 'Technical Revocations',
    }
    const countsByTypeData = []

    countsByAdmissionType.forEach(function (data) {
      const admissionType = data.admission_type;
      const count = parseInt(data.admission_count);
      countsByTypeData.push([labelStringConversion[admissionType], count])
    });

    countsByTypeData.sort(function(a, b) {
      return a[0] - b[0];
    })

    setChartLabels(countsByTypeData.map(element => element[0]));
    setChartDataPoints(countsByTypeData.map(element => element[1]));
  }

  useEffect(() => {
    processResponse();
  }, [props.admissionCountsByType]);

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
