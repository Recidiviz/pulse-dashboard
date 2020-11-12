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
  const isNested = denominators.every((denominator) =>
    Array.isArray(denominator)
  );
  const isStatisticsSignificant = (isNested
    ? denominators
    : [denominators]
  ).every((denominator) =>
    isDenominatorStatisticallySignificant(denominator[index])
  );

  if (isStatisticsSignificant) {
    return "";
  }
  return "* indicates the group is too small to make generalizations";
}

export {
  getBarBackgroundColor,
  isDenominatorStatisticallySignificant,
  isDenominatorsMatrixStatisticallySignificant,
  tooltipForFooterWithCounts,
};
