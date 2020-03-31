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

import "@testing-library/jest-dom/extend-expect";
import * as choroplethMethods from "../choropleth";

describe("test for choropleth", () => {
  it("color for charts with negative values", () => {
    const colorForValue = choroplethMethods.colorForValue(110, 110, true, true);
    expect(colorForValue).toBe("rgb(59, 31, 42)");

    const colorForNegativeValue = choroplethMethods.colorForValue(
      -110,
      110,
      true,
      true
    );
    expect(colorForNegativeValue).toBe("rgb(31, 42, 59)");

    const colorForValueUseDarkFalse = choroplethMethods.colorForValue(
      110,
      110,
      false,
      true
    );
    expect(colorForValueUseDarkFalse).toBe("rgb(209, 34, 73)");

    const colorForNegativeValueUseDarkFalse = choroplethMethods.colorForValue(
      -110,
      110,
      false,
      true
    );
    expect(colorForNegativeValueUseDarkFalse).toBe("rgb(63, 77, 98)");
  });

  it("color for charts without negative values", () => {
    const colorForValue = choroplethMethods.colorForValue(
      110,
      110,
      true,
      false
    );
    expect(colorForValue).toBe("rgb(31, 42, 59)");

    const colorForNegativeValue = choroplethMethods.colorForValue(
      -110,
      110,
      true,
      false
    );
    expect(colorForNegativeValue).toBe("rgb(255, 255, 255)");

    const colorForValueUseDarkFalse = choroplethMethods.colorForValue(
      110,
      110,
      false,
      false
    );
    expect(colorForValueUseDarkFalse).toBe("rgb(63, 77, 98)");

    const colorForNegativeValueUseDarkFalse = choroplethMethods.colorForValue(
      -110,
      110,
      false,
      false
    );
    expect(colorForNegativeValueUseDarkFalse).toBe("rgb(255, 255, 255)");
  });

  it("county name from code", () => {
    const newCountryName = choroplethMethods.countyNameFromCode(
      "CA",
      "Los Angeles Country"
    );
    expect(newCountryName).toBe("Los Angeles Country");

    const emptyCountryName = choroplethMethods.countyNameFromCode(
      undefined,
      undefined
    );
    expect(emptyCountryName).toBe(undefined);
  });
});
