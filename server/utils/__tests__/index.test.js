// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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
const { formatKeysToSnakeCase } = require("..");

describe("formatKeysToSnakeCase", () => {
  const camelCaseKeys = {
    violationType: "all",
    chargeCategory: "general",
  };

  it("transforms the keys to snakecase", () => {
    expect(formatKeysToSnakeCase(camelCaseKeys)).toEqual({
      violation_type: "all",
      charge_category: "general",
    });
  });

  it("keeps snakecase as is", () => {
    expect(
      formatKeysToSnakeCase({
        violation_type: "all",
        charge_category: "general",
      })
    ).toEqual({
      violation_type: "all",
      charge_category: "general",
    });
  });

  it("doesn't error on empty object", () => {
    expect(formatKeysToSnakeCase({})).toEqual({});
  });

  it("doesn't error with an undefined param", () => {
    expect(formatKeysToSnakeCase()).toEqual({});
  });

  it("doesn't error with a null param", () => {
    expect(formatKeysToSnakeCase(null)).toEqual({});
  });
});
