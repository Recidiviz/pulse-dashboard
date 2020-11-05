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

import getNameFromOfficerId from "../getNameFromOfficerId";

describe("getNameFromOfficerId tests", () => {
  it("should divide officer name and id, trim whitespace and return name", () => {
    expect(getNameFromOfficerId("100049: John Doe")).toBe("John Doe");
    expect(getNameFromOfficerId("1: William Collins ")).toBe("William Collins");
  });

  it("should return empty string if falsy value is passed", () => {
    expect(getNameFromOfficerId("")).toBe("");
    expect(getNameFromOfficerId(null)).toBe("");
    expect(getNameFromOfficerId(false)).toBe("");
    expect(getNameFromOfficerId()).toBe("");
  });

  it("should return officerId without changes if there is no didiver", () => {
    expect(getNameFromOfficerId("John Doe")).toBe("John Doe");
  });
});
