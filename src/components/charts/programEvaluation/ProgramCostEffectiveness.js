// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2019 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================

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
