import React, { useState, useEffect } from "react";

import { Bar } from 'react-chartjs-2';
import { COLORS, COLORS_GOOD_BAD } from "../../../assets/scripts/constants/colors";

const ProgramCostEffectiveness = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  const processResponse = () => {
    const costReductionByProgram = props.programCostEffectiveness;

    var sorted = [];
    for (var program in costReductionByProgram) {
        sorted.push([program, costReductionByProgram[program]]);
    }

    setChartLabels(sorted.map(element => element[0]));
    setChartDataPoints(sorted.map(element => element[1]));
  }

  useEffect(() => {
    processResponse();
  }, [props.programCostEffectiveness]);

  return (
    <Bar data={{
      labels: ['Program A', 'Program B', 'Program C', 'Program D', 'Program E', 'Program F'],
      datasets: [{
        label: 'Incarceration costs reduced',
        backgroundColor: function(context) {
           if (context.dataset.data[context.dataIndex] < 0) {
              return COLORS_GOOD_BAD['bad'];
           } else {
              return COLORS_GOOD_BAD['good']; }
            },
        borderColor: COLORS['grey-300'],
        borderWidth: 1,
        data: [-123600, 704000, 554400, 378400, -122200, -432800],
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
}

export default ProgramCostEffectiveness;
