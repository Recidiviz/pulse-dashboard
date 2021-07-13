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

import { translate } from "../../../../utils/i18nSettings";
import { parseAndFormatViolationRecord } from "../violationRecord";

jest.mock("../../../../utils/i18nSettings");
describe("parseAndFormatViolationRecord function", () => {
  const violationsBySeverity = ["fel", "misd", "absc", "muni", "tech"];
  const mockTranslations = {
    violationsBySeverity,
  };
  translate.mockImplementation((key) => mockTranslations[key]);

  test("formats semicolon-separated strings", () => {
    const rawInput = "1fel;4absc;1muni";
    const expectedOutput = "1 fel, 4 absc, 1 muni";

    expect(parseAndFormatViolationRecord(rawInput)).toBe(expectedOutput);
  });
  test("returns a string even when there is no input", () => {
    expect(parseAndFormatViolationRecord()).toBe("");
    expect(parseAndFormatViolationRecord("")).toBe("");
    expect(parseAndFormatViolationRecord(null)).toBe("");
  });
  test("handles multi-digit violation counts", () => {
    const rawInput = "1fel;13muni;400tech";
    const expectedOutput = "1 fel, 13 muni, 400 tech";

    expect(parseAndFormatViolationRecord(rawInput)).toBe(expectedOutput);
  });
  test("sorts violations by severity", () => {
    const rawInput = "4misd;1fel;9tech;2muni;1absc";
    const expectedOutput = "1 fel, 4 misd, 1 absc, 2 muni, 9 tech";

    expect(parseAndFormatViolationRecord(rawInput)).toBe(expectedOutput);
  });
});
