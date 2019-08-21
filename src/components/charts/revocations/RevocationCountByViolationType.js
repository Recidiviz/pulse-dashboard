import React, { useState, useEffect } from 'react';

import { Bar } from 'react-chartjs-2';
import { COLORS_FIVE_VALUES } from '../../../assets/scripts/constants/colors';
import { monthNamesFromNumberList } from '../../../utils/monthConversion';

const RevocationCountByViolationType = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [absconsionDataPoints, setAbsconsionDataPoints] = useState([]);
  const [newOffenseDataPoints, setNewOffenseDataPoints] = useState([]);
  const [technicalDataPoints, setTechnicalDataPoints] = useState([]);
  const [unknownDataPoints, setUnknownDataPoints] = useState([]);

  const processResponse = () => {
    const { revocationCountsByMonthByViolationType: countsByMonth } = props;

    let sorted = [];
    countsByMonth.forEach((data) => {
      const { year } = data;
      const { month } = data;
      const { absconsion_count: absconsionCount } = data;
      const { felony_count: felonyCount } = data;
      const { technical_count: technicalCount } = data;
      const { unknown_count: unknownCount } = data;

      const monthDict = {
        ABSCONDED: absconsionCount,
        FELONY: felonyCount,
        TECHNICAL: technicalCount,
        UNKNOWN_VIOLATION_TYPE: unknownCount,
      };

      sorted.push([year, month, monthDict]);
    });

    // Sort by month and year
    sorted.sort((a, b) => ((a[0] === b[0]) ? (a[1] - b[1]) : (a[0] - b[0])));

    // Just display the most recent 6 months
    sorted = sorted.slice(sorted.length - 6, sorted.length);

    const monthsLabels = [];
    const violationArrays = {
      ABSCONDED: [],
      FELONY: [],
      TECHNICAL: [],
      UNKNOWN_VIOLATION_TYPE: [],
    };

    for (let i = 0; i < 6; i += 1) {
      monthsLabels.push(sorted[i][1]);
      const data = sorted[i][2];
      Object.keys(data).forEach((violationType) => {
        violationArrays[violationType].push(data[violationType]);
      });
    }

    setChartLabels(monthNamesFromNumberList(monthsLabels));
    setAbsconsionDataPoints(violationArrays.ABSCONDED);
    setNewOffenseDataPoints(violationArrays.FELONY);
    setTechnicalDataPoints(violationArrays.TECHNICAL);
    setUnknownDataPoints(violationArrays.UNKNOWN_VIOLATION_TYPE);
  };

  useEffect(() => {
    processResponse();
  }, [props.revocationCountsByMonthByViolationType]);

  return (
    <Bar
      data={{
        labels: chartLabels,
        datasets: [{
          label: 'Absconsion',
          backgroundColor: COLORS_FIVE_VALUES[0],
          data: absconsionDataPoints,
        }, {
          label: 'New Offense',
          backgroundColor: COLORS_FIVE_VALUES[1],
          data: newOffenseDataPoints,
        }, {
          label: 'Technical',
          backgroundColor: COLORS_FIVE_VALUES[2],
          data: technicalDataPoints,
        }, {
          label: 'Unknown Type',
          backgroundColor: COLORS_FIVE_VALUES[3],
          data: unknownDataPoints,
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
};

export default RevocationCountByViolationType;
