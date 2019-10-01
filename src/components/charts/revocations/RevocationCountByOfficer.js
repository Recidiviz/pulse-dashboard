import React, { useState, useEffect } from 'react';

import { Bar } from 'react-chartjs-2';
import { COLORS_FIVE_VALUES } from '../../../assets/scripts/constants/colors';

const RevocationCountByOfficer = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [absconsionDataPoints, setAbsconsionDataPoints] = useState([]);
  const [newOffenseDataPoints, setNewOffenseDataPoints] = useState([]);
  const [technicalDataPoints, setTechnicalDataPoints] = useState([]);
  const [unknownDataPoints, setUnknownDataPoints] = useState([]);

  const processResponse = () => {
    const { revocationCountsByOfficer } = props;

    const dataPoints = [];
    revocationCountsByOfficer.forEach((data) => {
      const {
        officer_external_id: officerID, absconsion_count: absconsionCount,
        felony_count: felonyCount, technical_count: technicalCount,
        unknown_count: unknownCount,
      } = data;

      const violationsByType = {
        ABSCONDED: parseInt(absconsionCount, 10),
        FELONY: parseInt(felonyCount, 10),
        TECHNICAL: parseInt(technicalCount, 10),
        UNKNOWN_VIOLATION_TYPE: parseInt(unknownCount, 10),
      };

      let overallRevocationCount = 0;
      Object.keys(violationsByType).forEach((violationType) => {
        overallRevocationCount += violationsByType[violationType];
      });

      if (officerID !== 'OFFICER_UNKNOWN') {
        dataPoints.push({
          officerID,
          violationsByType,
          overallRevocationCount,
        });
      }
    });

    const officerLabels = [];
    const violationArrays = {
      ABSCONDED: [],
      FELONY: [],
      TECHNICAL: [],
      UNKNOWN_VIOLATION_TYPE: [],
    };

    const sortedDataPoints = dataPoints.sort((a, b) => (
      b.overallRevocationCount - a.overallRevocationCount));

    for (let i = 0; i < 10; i += 1) {
      officerLabels.push(sortedDataPoints[i].officerID);
      const data = sortedDataPoints[i].violationsByType;
      Object.keys(data).forEach((violationType) => {
        violationArrays[violationType].push(data[violationType]);
      });
    }

    setChartLabels(officerLabels);
    setAbsconsionDataPoints(violationArrays.ABSCONDED);
    setNewOffenseDataPoints(violationArrays.FELONY);
    setTechnicalDataPoints(violationArrays.TECHNICAL);
    setUnknownDataPoints(violationArrays.UNKNOWN_VIOLATION_TYPE);
  };

  useEffect(() => {
    processResponse();
  }, [props.revocationCountsByOfficer]);

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
          callbacks: {
            title: (tooltipItem) => ('Officer '.concat(tooltipItem[0].label)),
          },
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Officer ID',
            },
            stacked: true,
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Revocation count',
            },
            stacked: true,
            ticks: {
              stepSize: 1,
            },
          }],
        },
      }}
    />
  );
};


export default RevocationCountByOfficer;
