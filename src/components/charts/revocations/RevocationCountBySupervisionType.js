import React, { useState, useEffect } from 'react';

import { Bar } from 'react-chartjs-2';
import { COLORS_STACKED_TWO_VALUES } from '../../../assets/scripts/constants/colors';
import { monthNamesWithYearsFromNumbers } from '../../../utils/monthConversion';
import { sortAndFilterMostRecentMonths } from '../../../utils/dataOrganizing';

const RevocationCountBySupervisionType = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [paroleDataPoints, setParoleDataPoints] = useState([]);
  const [probationDataPoints, setProbationDataPoints] = useState([]);

  const processResponse = () => {
    const { revocationCountsByMonthBySupervisionType: countsByMonth } = props;

    const paroleData = [];
    const probationData = [];
    countsByMonth.forEach((data) => {
      const {
        year, month, parole_count: paroleCount, probation_count: probationCount,
      } = data;
      paroleData.push({ year, month, paroleCount });
      probationData.push({ year, month, probationCount });
    });

    const sortedParoleData = sortAndFilterMostRecentMonths(paroleData, 6);
    const sortedProbationData = sortAndFilterMostRecentMonths(probationData, 6);

    setChartLabels(monthNamesWithYearsFromNumbers(sortedParoleData.map(
      (element) => element.month,
    ), false));
    setParoleDataPoints(sortedParoleData.map((element) => element.paroleCount));
    setProbationDataPoints(sortedProbationData.map((element) => element.probationCount));
  };

  useEffect(() => {
    processResponse();
  }, [props.revocationCountsByMonthBySupervisionType]);

  return (
    <Bar
      data={{
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
              labelString: 'Revocation count',
            },
            stacked: true,
          }],
        },
      }}
    />
  );
};

export default RevocationCountBySupervisionType;
