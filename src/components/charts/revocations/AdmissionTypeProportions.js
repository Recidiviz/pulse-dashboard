import React, { useState, useEffect } from 'react';

import { Pie } from 'react-chartjs-2';
import { COLORS_FIVE_VALUES } from '../../../assets/scripts/constants/colors';

const AdmissionTypeProportions = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  const processResponse = () => {
    const { admissionCountsByType } = props;

    const labelStringConversion = {
      UNKNOWN_REVOCATION: 'Revocations (Type Unknown)',
      NEW_ADMISSION: 'New Admissions',
      NON_TECHNICAL: 'Non-Technical Revocations',
      TECHNICAL: 'Technical Revocations',
    };

    const countsByTypeData = [];
    admissionCountsByType.forEach((data) => {
      const { admission_type: admissionType } = data;
      const count = parseInt(data.admission_count, 10);
      countsByTypeData.push([labelStringConversion[admissionType], count]);
    });

    // Sort by label
    countsByTypeData.sort((a, b) => (a[0].localeCompare(b[0])));

    setChartLabels(countsByTypeData.map((element) => element[0]));
    setChartDataPoints(countsByTypeData.map((element) => element[1]));
  };

  useEffect(() => {
    processResponse();
  }, [props.admissionCountsByType]);

  return (
    <Pie
      data={{
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
            label: (tooltipItem, data) => {
              const dataset = data.datasets[tooltipItem.datasetIndex];

              const total = dataset.data.reduce(
                (previousValue, currentValue) => (previousValue + currentValue),
              );

              const currentValue = dataset.data[tooltipItem.index];
              const percentage = ((currentValue / total) * 100).toFixed(2);

              return (data.labels[tooltipItem.index]).concat(': ', currentValue, ' (', percentage, '%)');
            },
          },
        },
      }}
    />
  );
};

export default AdmissionTypeProportions;
