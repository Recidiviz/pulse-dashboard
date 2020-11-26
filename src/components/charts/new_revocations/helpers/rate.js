// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
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

/**
 * Calculates rate
 */
export const calculateRate = (numerator, denominator) =>
  denominator === 0 || numerator === 0 ? 0 : (100 * numerator) / denominator;

export const getRateAnnotation = (averageRate) => ({
  drawTime: "afterDatasetsDraw",
  annotations: [
    {
      drawTime: "afterDraw",
      type: "line",
      mode: "horizontal",
      scaleID: "y-axis-0",
      value: averageRate,
      borderColor: "rgba(242, 104, 37, 0.5)",
      borderWidth: 2,
      label: {
        backgroundColor: "transparent",
        fontColor: "#72777a",
        fontStyle: "normal",
        enabled: true,
        content: `Overall: ${averageRate.toFixed(2)}%`,
        position: "right",
        yAdjust: -10,
      },
    },
  ],
});
