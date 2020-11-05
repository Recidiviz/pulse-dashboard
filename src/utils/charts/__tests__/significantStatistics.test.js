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

import {
  isDenominatorStatisticallySignificant,
  isDenominatorsMatrixStatisticallySignificant,
  tooltipForFooterWithCounts,
} from "../significantStatistics";

const statisticallySignificantDenominators = [0, 100, 1019];
const statisticallyNotSignificantDenominators = [1, 10, 99];

const statisticallySignificantDenominatorMatrix = [
  [100, 234, 235, 123],
  [930, 823, 348, 729],
  [0, 829, 520, 327],
  [981, 0, 124, 987],
];

const statisticallyNotSignificantDenominatorMatrix = [
  [100, 234, 235, 123],
  [930, 823, 348, 729],
  [0, 829, 20, 327],
  [981, 0, 124, 987],
];

describe("isDenominatorStatisticallySignificant function", () => {
  it("should not be statistically significant", () => {
    const given = statisticallyNotSignificantDenominators;

    given.forEach((denominator) => {
      expect(isDenominatorStatisticallySignificant(denominator)).toBe(false);
    });
  });

  it("should be statistically significant", () => {
    const given = statisticallySignificantDenominators;

    given.forEach((denominator) => {
      expect(isDenominatorStatisticallySignificant(denominator)).toBe(true);
    });
  });
});

describe("isDenominatorsMatrixStatisticallySignificant function", () => {
  it("should not be statistically significant", () => {
    const given = statisticallyNotSignificantDenominatorMatrix;

    expect(isDenominatorsMatrixStatisticallySignificant(given)).toBe(false);
  });

  it("should be statistically significant", () => {
    const given = statisticallySignificantDenominatorMatrix;

    expect(isDenominatorsMatrixStatisticallySignificant(given)).toBeTrue();
  });
});

describe("tooltipForFooterWithCounts function", () => {
  it("returns warning footnote", () => {
    const given = statisticallyNotSignificantDenominators;
    const index = 2;

    expect(tooltipForFooterWithCounts([{ index }], given)).toBe(
      "* indicates the group is too small to make generalizations"
    );
  });

  it("returns empty footnote", () => {
    const given = statisticallySignificantDenominators;
    const index = 1;

    expect(tooltipForFooterWithCounts([{ index }], given)).toBe("");
  });

  it("returns warning footnote for matrix", () => {
    const given = statisticallyNotSignificantDenominatorMatrix;
    const index = 2;

    expect(tooltipForFooterWithCounts([{ index }], given)).toBe(
      "* indicates the group is too small to make generalizations"
    );
  });

  it("returns empty footnote for matrix", () => {
    const given = statisticallyNotSignificantDenominatorMatrix;
    const index = 3;

    expect(tooltipForFooterWithCounts([{ index }], given)).toBe("");
  });
});
