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

import { Chart } from 'react-chartjs-2';
import pattern from 'patternomaly';

function isDenominatorStatisticallySignificant(denomintor = 0) {
  return denomintor === 0 || denomintor >= 100;
}

function isDenominatorsMatrixStatisticallySignificant(denominatorsMatrix) {
  return !denominatorsMatrix.flat().some(d => !isDenominatorStatisticallySignificant(d));
}

function getBackgroundColor(color, denominators) {
  return ({ dataIndex, dataset, datasetIndex }) => {
    if (isDenominatorStatisticallySignificant(denominators[datasetIndex][dataIndex])) {
      return color;
    } else {
      return pattern.draw('diagonal-right-left', color, '#ffffff', 5);
    }
  }
}

function tooltipForFooterWithCounts([{ index }], denominators) {
  if (isDenominatorStatisticallySignificant(denominators[index])) {
    return '';
  } else {
    return '* indicates low confidence due to small sample size';
  }
}

function tooltipForFooterWithNestedCounts([{ index }], denominatorCounts) {
  if (denominatorCounts.some(denominators => !isDenominatorStatisticallySignificant(denominators[index]))) {
    return '* indicates low confidence due to small sample size';
  } else {
    return '';
  }
}

/**
 * Hack function for regenerate legend labels with custom colors
 * because if chart bar is not statistically significant we should
 * change color (add line shading) and after that chart do not know
 * which color is right (with line shading or not).
 */
function generateLabelsWithCustomColors(chart, colors) {
  return Chart.defaults.global.legend.labels
    .generateLabels(chart)
    .map((label, i) => ({ ...label, fillStyle: colors[i] }))
}

export {
  generateLabelsWithCustomColors,
  getBackgroundColor,
  isDenominatorStatisticallySignificant,
  isDenominatorsMatrixStatisticallySignificant,
  tooltipForFooterWithCounts,
  tooltipForFooterWithNestedCounts,
}
