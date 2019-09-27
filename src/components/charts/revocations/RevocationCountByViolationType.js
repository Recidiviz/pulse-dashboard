import React, { useState, useEffect } from 'react';

import { Bar } from 'react-chartjs-2';
import { COLORS_FIVE_VALUES } from '../../../assets/scripts/constants/colors';
import { monthNamesWithYearsFromNumbers } from '../../../utils/monthConversion';
import { sortAndFilterMostRecentMonths } from '../../../utils/dataOrganizing';

const RevocationCountByViolationType = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [absconsionDataPoints, setAbsconsionDataPoints] = useState([]);
  const [newOffenseDataPoints, setNewOffenseDataPoints] = useState([]);
  const [technicalDataPoints, setTechnicalDataPoints] = useState([]);
  const [unknownDataPoints, setUnknownDataPoints] = useState([]);

  const processResponse = () => {
    const { revocationCountsByMonthByViolationType: countsByMonth } = props;

    let dataPoints = [];
    countsByMonth.forEach((data) => {
      const {
        year, month, absconsion_count: absconsionCount,
        felony_count: felonyCount, technical_count: technicalCount,
        unknown_count: unknownCount,
      } = data;

      const monthDict = {
        ABSCONDED: absconsionCount,
        FELONY: felonyCount,
        TECHNICAL: technicalCount,
        UNKNOWN_VIOLATION_TYPE: unknownCount,
      };

      dataPoints.push({ year, month, monthDict });
    });

    const sorted = sortAndFilterMostRecentMonths(dataPoints, 6);

    const monthsLabels = [];
    const violationArrays = {
      ABSCONDED: [],
      FELONY: [],
      TECHNICAL: [],
      UNKNOWN_VIOLATION_TYPE: [],
    };

    for (let i = 0; i < 6; i += 1) {
      monthsLabels.push(sorted[i].month);
      const data = sorted[i].monthDict;
      Object.keys(data).forEach((violationType) => {
        violationArrays[violationType].push(data[violationType]);
      });
    }

    setChartLabels(monthNamesWithYearsFromNumbers(monthsLabels, false));
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
              labelString: 'Revocation count',
            },
            stacked: true,
          }],
        },
      }}
    />
  );
};

export default RevocationCountByViolationType;
