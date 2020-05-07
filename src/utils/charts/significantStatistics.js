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

import pattern from "patternomaly";
import { Chart } from "react-chartjs-2";

function isDenominatorStatisticallySignificant(denominator = 0) {
  return denominator === 0 || denominator >= 100;
}

function isDenominatorsMatrixStatisticallySignificant(denominatorsMatrix) {
  return ![]
    .concat(...denominatorsMatrix)
    .some((d) => !isDenominatorStatisticallySignificant(d));
}

function getBarBackgroundColor(color, denominators) {
  const shadingSize = 5;

  return ({ datasetIndex: i, dataIndex: j }) => {
    if (isDenominatorStatisticallySignificant(denominators[i][j])) {
      return color;
    }
    return pattern.draw("diagonal-right-left", color, "#ffffff", shadingSize);
  };
}

function tooltipForFooterWithCounts([{ index }], denominators) {
  if (isDenominatorStatisticallySignificant(denominators[index])) {
    return "";
  }
  return "* indicates low confidence due to small sample size";
}

function tooltipForFooterWithNestedCounts([{ index }], denominatorCounts) {
  const isStatisticsImplicit = denominatorCounts.some(
    (denominators) =>
      !isDenominatorStatisticallySignificant(denominators[index])
  );

  if (isStatisticsImplicit) {
    return "* indicates low confidence due to small sample size";
  }
  return "";
}

/**
 * A hacky function to regenerate legend labels with custom colors.
 * If a chart bar is not statistically significant we should change its color/pattern (i.e. add line shading).
 * But labels/legends were generated ahead of time so the chart needs to be told to re-render them.
 */
function generateLabelsWithCustomColors(chart, colors) {
  return Chart.defaults.global.legend.labels
    .generateLabels(chart)
    .map((label, i) => ({ ...label, fillStyle: colors[i] }));
}

export {
  generateLabelsWithCustomColors,
  getBarBackgroundColor,
  isDenominatorStatisticallySignificant,
  isDenominatorsMatrixStatisticallySignificant,
  tooltipForFooterWithCounts,
  tooltipForFooterWithNestedCounts,
};
