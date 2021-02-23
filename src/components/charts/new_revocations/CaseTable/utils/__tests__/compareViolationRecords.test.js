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

import { translate } from "../../../../../../utils/i18nSettings";
import { compareViolationRecords } from "../compareViolationRecords";

jest.mock("../../../../../../utils/i18nSettings");
describe("compareViolationRecords function", () => {
  const violationsBySeverity = ["fel", "misd", "absc", "muni", "tech"];
  const mockTranslations = {
    violationsBySeverity,
  };
  translate.mockImplementation((key) => mockTranslations[key]);

  it("if rows have no valid violations should stay in the same order", () => {
    const given = ["", "dsadasd", "fel", "ifoewnfwneog", "fdoiafad", "sada"];

    given.sort((a, b) => compareViolationRecords(a, b));
    expect(given).toEqual([
      "",
      "dsadasd",
      "fel",
      "ifoewnfwneog",
      "fdoiafad",
      "sada",
    ]);
  });

  it("if some rows have valid violations and some are not should prioritize valid ones", () => {
    const given = ["", "1fel", "1muni", "dsadasd"];

    given.sort((a, b) => compareViolationRecords(a, b));
    expect(given).toEqual(["", "dsadasd", "1muni", "1fel"]);
  });

  it("should sort by the most severe violation(ascending)", () => {
    const given = [
      "4muni;1misd",
      "1absc;1tech",
      "1fel;3tech",
      "1muni",
      "1tech",
    ];

    given.sort((a, b) => compareViolationRecords(a, b));
    expect(given).toEqual([
      "1tech",
      "1muni",
      "1absc;1tech",
      "4muni;1misd",
      "1fel;3tech",
    ]);
  });

  it("Given a tie in the most severe violation, sort by number of most severe violation(ascending)", () => {
    let given = ["1fel;2misd", "2fel;488tech"];
    given.sort((a, b) => compareViolationRecords(a, b));
    expect(given).toEqual(["1fel;2misd", "2fel;488tech"]);

    given = ["3misd;1tech", "1misd;2absc", "2absc;1tech"];
    given.sort((a, b) => compareViolationRecords(a, b));
    expect(given).toEqual(["2absc;1tech", "1misd;2absc", "3misd;1tech"]);
  });

  it("Given a tie in the number of most severe violation, sort based on number of total violations(ascending)", () => {
    let given = [
      "2fel;2misd;400tech",
      "2fel;1misd;401tech",
      "2fel;3misd",
      "2fel;5misd;1absc;1tech",
    ];
    given.sort((a, b) => compareViolationRecords(a, b));
    expect(given).toEqual([
      "2fel;3misd",
      "2fel;5misd;1absc;1tech",
      "2fel;2misd;400tech",
      "2fel;1misd;401tech",
    ]);

    given = [
      "2fel;2misd;400tech",
      "2fel;3misd",
      "2fel;5misd;1absc;1tech",
      "2fel;1misd;401tech",
    ];
    given.sort((a, b) => compareViolationRecords(a, b));
    expect(given).toEqual([
      "2fel;3misd",
      "2fel;5misd;1absc;1tech",
      "2fel;2misd;400tech",
      "2fel;1misd;401tech",
    ]);
  });

  it("more custom tests", () => {
    let given = ["1misd;1tech", "2absc", "3fel", "1fel;1muni", "2muni"];
    given.sort((a, b) => compareViolationRecords(a, b));
    expect(given).toEqual([
      "2muni",
      "2absc",
      "1misd;1tech",
      "1fel;1muni",
      "3fel",
    ]);

    given = ["2fel", "1fel;2misc;3absc"];
    given.sort((a, b) => compareViolationRecords(a, b));
    expect(given).toEqual(["1fel;2misc;3absc", "2fel"]);

    given = ["3fel", "2misd;3absc;9muni;4tech"];
    given.sort((a, b) => compareViolationRecords(a, b));
    expect(given).toEqual(["2misd;3absc;9muni;4tech", "3fel"]);
  });
});
