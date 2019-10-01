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
import { COLORS, COLORS_STACKED_TWO_VALUES } from '../../../assets/scripts/constants/colors';

const RecidivismRateByProgram = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [newOffensesDataPoints, setNewOffensesDataPoints] = useState([]);
  const [revocationDataPoints, setRevocationDataPoints] = useState([]);

  const processResponse = () => {
    const rateByProgram = props.recidivismRateByProgram;

    if (rateByProgram) {
      // Only one element in this JSON array
      const ratesByProgram = rateByProgram[0];
      const sorted = [];
      for (let program in ratesByProgram) {
          sorted.push([program, ratesByProgram[program]]);
      }

      setChartLabels(sorted.map((element) => element[0]));
      setNewOffensesDataPoints(sorted.map((element) => element[1].newOffenses));
      setRevocationDataPoints(sorted.map((element) => element[1].revocations));
    }
  };

  useEffect(() => {
    processResponse();
  }, [props.recidivismRateByProgram]);

  return (
    <Bar
      data={{
        labels: chartLabels,
        datasets: [{
          label: 'New offenses',
          backgroundColor: COLORS_STACKED_TWO_VALUES[0],
          borderColor: COLORS_STACKED_TWO_VALUES[0],
          borderWidth: 1,
          data: newOffensesDataPoints,
        }, {
          label: 'Revocations',
          backgroundColor: COLORS_STACKED_TWO_VALUES[1],
          borderColor: COLORS_STACKED_TWO_VALUES[1],
          borderWidth: 1,
          data: revocationDataPoints,
        }],
      }}
      options={{
        responsive: true,
        legend: {
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
            stacked: true,
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Recidivism rate',
            },
            stacked: true,
          }],
        },
        annotation: {
          events: ['click'],
          annotations: [{
            type: 'line',
            mode: 'horizontal',
            value: 45,

            // optional annotation ID (must be unique)
            id: 'program-recidivism-baseline',
            scaleID: 'y-axis-0',

            drawTime: 'afterDatasetsDraw',

            borderColor: COLORS['grey-700'],
            borderWidth: 2,
            borderDash: [2, 2],
            borderDashOffset: 5,
            label: {
              enabled: false,
              content: 'State recidivism rate',
              position: 'center',

              // Background color of label, default below
              backgroundColor: 'rgba(0,0,0,0.1)',

              fontFamily: 'sans-serif',
              fontSize: 12,
              fontStyle: 'bold',
              fontColor: '#000',

              // Adjustment along x-axis (left-right) of label relative to above
              // number (can be negative). For horizontal lines positioned left
              // or right, negative values move the label toward the edge, and
              // positive values toward the center.
              xAdjust: 0,

              // Adjustment along y-axis (top-bottom) of label relative to above
              // number (can be negative). For vertical lines positioned top or
              // bottom, negative values move the label toward the edge, and
              // positive values toward the center.
              yAdjust: 0,
            },

            onClick(e) { return e; },
          }],
        },
      }}
    />
  );
};

export default RecidivismRateByProgram;
