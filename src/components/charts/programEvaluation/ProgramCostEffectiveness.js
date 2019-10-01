import React, { useState, useEffect } from 'react';

import { Bar } from 'react-chartjs-2';
import { COLORS, COLORS_GOOD_BAD } from '../../../assets/scripts/constants/colors';

const ProgramCostEffectiveness = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  const processResponse = () => {
    let costReductionByProgram = props.programCostEffectiveness;

    if (costReductionByProgram) {
      // Only one element in this JSON array
      costReductionByProgram = costReductionByProgram[0];
      const sorted = [];
      for (let program in costReductionByProgram) {
        sorted.push([program, costReductionByProgram[program]]);
      }

      setChartLabels(sorted.map((element) => element[0]));
      setChartDataPoints(sorted.map((element) => element[1]));
    }
  };

  useEffect(() => {
    processResponse();
  }, [props.programCostEffectiveness]);

  return (
    <Bar
      data={{
        labels: chartLabels,
        datasets: [{
          label: 'Incarceration costs reduced',
          backgroundColor(context) {
            if (context.dataset.data[context.dataIndex] < 0) {
              return COLORS_GOOD_BAD.bad;
            }
            return COLORS_GOOD_BAD.good;
          },
          borderColor: COLORS['grey-300'],
          borderWidth: 1,
          data: chartDataPoints,
        }],
      }}
      options={{
        responsive: true,
        legend: {
          display: false,
          position: 'top',
        },
        tooltips: {
          mode: 'index',
          intersect: false,
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
              labelString: 'ROI per 100 people',
            },
          }],
        },
      }}
    />
  );
};

export default ProgramCostEffectiveness;
