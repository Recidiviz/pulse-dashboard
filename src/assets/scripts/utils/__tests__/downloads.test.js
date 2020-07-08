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

import { getFilters } from "../downloads";

describe("#getFilters", () => {
  it("outputs all filters with value 'All'", () => {
    const given = {
      metricPeriodMonths: "12",
      district: "All",
      chargeCategory: "All",
      supervisionType: "All",
    };

    const expected =
      "1 year, All districts, All case types, All supervision types";

    expect(getFilters(given)).toBe(expected);
  });

  it("outputs all filters with custom values", () => {
    const given = {
      metricPeriodMonths: "36",
      district: "SLCRC",
      chargeCategory: "SEX_OFFENCE",
      supervisionType: "PROBATION",
    };

    const expected =
      "3 years, District: SLCRC, Case type: Sex Offence, Supervision type: Probation";

    expect(getFilters(given)).toBe(expected);
  });

  it("outputs all expect supervision type", () => {
    const given = {
      metricPeriodMonths: "12",
      district: "All",
      chargeCategory: "All",
    };

    const expected = "1 year, All districts, All case types";

    expect(getFilters(given)).toBe(expected);
  });
});
