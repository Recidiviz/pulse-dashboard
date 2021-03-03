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

import getFilterDescription from "../getFilterDescription";

describe("getFilterDescription tests", () => {
  it("outputs all filters with value 'All'", () => {
    const given = {
      metricPeriodMonths: "12",
      district: "All",
      chargeCategory: "All",
      supervisionType: "All",
      supervisionLevel: "All",
    };

    const expected =
      "1 year, All districts, All case types, All supervision types, All supervision levels";

    expect(getFilterDescription(given)).toBe(expected);
  });

  it("outputs all filters with custom values", () => {
    const given = {
      metricPeriodMonths: "36",
      district: "SLCRC",
      chargeCategory: "SEX_OFFENCE",
      supervisionType: "PROBATION",
      supervisionLevel: "ENHANCED",
    };

    const expected =
      "3 years, District: SLCRC, Case type: Sex Offence, Supervision type: Probation, Supervision level: Enhanced Supervision";

    expect(getFilterDescription(given)).toBe(expected);
    expect(getFilterDescription({})).toBe("");
    expect(getFilterDescription({ metricPeriodMonths: "1" })).toBe("1 month");
    expect(getFilterDescription({ metricPeriodMonths: "3" })).toBe("3 months");
    expect(getFilterDescription({ metricPeriodMonths: "6" })).toBe("6 months");
    expect(getFilterDescription({ metricPeriodMonths: "any" })).toBe("1 month");
  });

  it("outputs all expect supervision type", () => {
    const given = {
      metricPeriodMonths: "12",
      district: "All",
      chargeCategory: "All",
    };

    const expected = "1 year, All districts, All case types";

    expect(getFilterDescription(given)).toBe(expected);
  });

  it("outputs all expected admission type", () => {
    const given = {
      metricPeriodMonths: "12",
      admissionType: [
        "SHOCK_INCARCERATION_0_TO_6_MONTHS",
        "SHOCK_INCARCERATION_6_MONTHS",
        "SHOCK_INCARCERATION_9_MONTHS",
        "SHOCK_INCARCERATION_12_MONTHS",
      ],
    };

    const expected =
      "1 year, Admission type: SCI < 6 months, SCI 6 months, SCI 9 months, SCI 12 months";

    expect(getFilterDescription(given)).toBe(expected);
  });
});
