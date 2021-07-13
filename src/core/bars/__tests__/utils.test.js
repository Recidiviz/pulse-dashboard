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

import { groupByMonth, isValidOffice, isValidOfficer, sum } from "../utils";

describe("Utils for bar chars", () => {
  it("#sum", () => {
    expect(sum("1", "2")).toBe(3);
    expect(sum("1", "asd")).toBe(1);
  });

  it("#groupByMonth", () => {
    const given = [
      { year: "2017", month: "1", count: "3", district: "1" },
      { year: "2017", month: "1", count: "8", district: "2" },
      { year: "2017", month: "2", count: "9", district: "1" },
      { year: "2017", month: "2", count: "1", district: "2" },
    ];

    const expected = [
      { year: "2017", month: "1", count: 11 },
      { year: "2017", month: "2", count: 10 },
    ];

    expect(groupByMonth(["count"])(given)).toEqual(expected);
  });

  it("#isValidOffice", () => {
    expect(isValidOffice(["all"])({ district: "bismarck" })).toBeTrue();
    expect(
      isValidOffice(["beaulah", "bismarck"])({ district: "beaulah" })
    ).toBeTrue();
  });

  it("#isValidOfficer", () => {
    const offices = {
      1: "bismarck",
      2: "jamestown",
      3: "minot",
      4: "fargo",
    };
    expect(
      isValidOfficer(offices)({
        district: "1",
        officer_external_id: "19: Woodstock Bird",
      })
    ).toBeTrue();

    expect(
      isValidOfficer(offices)({
        district: "1",
        officer_external_id: "OFFICER_UNKNOWN",
      })
    ).toBeFalse();
  });
});
