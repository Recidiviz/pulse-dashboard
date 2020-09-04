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

const {
  default: convertFileContentToJson,
} = require("../convertFileContentToJson");

describe("convertFileContentToJson tests", () => {
  it("should return null if file is empty", () => {
    const mockContent = "";
    const contents = Buffer.from(mockContent);

    expect(convertFileContentToJson(contents)).toStrictEqual(null);
  });

  it("should transform file content to json", () => {
    const mockContent =
      '{"first_key":"first line"}\n{"second_key": "second value"}\n';
    const contents = Buffer.from(mockContent);

    expect(convertFileContentToJson(contents)).toStrictEqual([
      { first_key: "first line" },
      { second_key: "second value" },
    ]);
  });
});
