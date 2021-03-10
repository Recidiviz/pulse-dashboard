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
import tk from "timekeeper";
import * as labelsMethods from "../labels";

describe("test label", () => {
  it("get gender from array genderValuetoLabel", () => {
    const testValueGender = "FEMALE";
    const dataAfterTest = labelsMethods.genderValueToHumanReadable(
      testValueGender
    );
    expect(dataAfterTest).toBe("Female");

    const dataErrorAfterTest = labelsMethods.genderValueToHumanReadable(
      "White"
    );
    expect(dataErrorAfterTest).toBe(undefined);
  });

  it("get race from  array raceValuetoLabel", () => {
    const testValueRace = "WHITE";
    const dataAfterTest = labelsMethods.raceValueToHumanReadable(testValueRace);
    expect(dataAfterTest).toBe("White");
  });

  it("to Html friendly", () => {
    const dataAfterTest = labelsMethods.toHtmlFriendly("Los Angeles");
    expect(dataAfterTest.toString()).toEqual("Los-Angeles");
  });

  it("to Html friendly with multiple spaces", () => {
    const dataAfterTest = labelsMethods.toHtmlFriendly(
      "Los Angeles  California"
    );
    expect(dataAfterTest.toString()).toEqual("Los-Angeles-California");
  });

  it("to Html friendly with html forbidden symbols", () => {
    const dataAfterTest = labelsMethods.toHtmlFriendly(
      "A&P Grocery in California"
    );
    expect(dataAfterTest.toString()).toEqual("A-P-Grocery-in-California");
  });

  it("to human readable", () => {
    const dataAfterTest = labelsMethods.toHumanReadable("Los-Angeles");
    expect(dataAfterTest.toString()).toEqual("Los Angeles");
  });

  it("toInt", () => {
    const dataForTest = "999: Lavena Banbridge";
    const dataAfterTest = labelsMethods.toInt(dataForTest);
    expect(dataAfterTest).toBe(999);

    const dataErrorAfterTest = labelsMethods.toInt("Banbridge");
    expect(dataErrorAfterTest).toBe(NaN);
  });

  it("to title case", () => {
    const dataForTest = "LOS ANGELES";
    const dataAfterTest = labelsMethods.toTitleCase(dataForTest);
    expect(dataAfterTest).toEqual("Los Angeles");

    const dataErrorAfterTest = labelsMethods.toTitleCase("");
    expect(dataErrorAfterTest).toEqual("");
  });

  it("human readable title case with underscores", () => {
    const dataForTesting = "SAN_FRANCISCO_CALIFORNIA";
    const dataAfterTest = labelsMethods.humanReadableTitleCase(dataForTesting);
    expect(dataAfterTest).toEqual("San Francisco California");
  });

  it("human readable title case with hyphens", () => {
    const dataForTesting = "SAN-FRANCISCO-CALIFORNIA";
    const dataAfterTest = labelsMethods.humanReadableTitleCase(dataForTesting);
    expect(dataAfterTest).toEqual("San Francisco California");
  });

  it("human readable title case with a mix of punctuation", () => {
    const dataForTesting = "SAN_FRANCISCO-CALIFORNIA";
    const dataAfterTest = labelsMethods.humanReadableTitleCase(dataForTesting);
    expect(dataAfterTest).toEqual("San Francisco California");
  });

  it("number from officer id", () => {
    const dataForTest = "27: Patricia Mayonnaise";
    const dataAfterTest = labelsMethods.numberFromOfficerId(dataForTest);
    expect(dataAfterTest).toBe(27);
  });

  it("pluralize when it should not pluralize", () => {
    const result = labelsMethods.pluralize(1, "violation");
    expect(result).toEqual("1 violation");
  });

  it("pluralize when it should pluralize", () => {
    const result = labelsMethods.pluralize(2, "violation");
    expect(result).toEqual("2 violations");
  });
  describe("labels formatting", () => {
    describe("getPeriodLabelFromMetricPeriodMonthsFilter", () => {
      it("formats the months label correctly", () => {
        const testDate = new Date("2020-02-14T11:01:58.135Z");
        tk.freeze(testDate);

        const periodMonth = labelsMethods.getPeriodLabelFromMetricPeriodMonthsFilter(
          12
        );
        expect(periodMonth).toBe("3/1/2019 to present");

        const emptyPeriodMonth = labelsMethods.getPeriodLabelFromMetricPeriodMonthsFilter(
          undefined
        );
        expect(emptyPeriodMonth).toBe("Invalid date to present");

        const incorrectPeriodMonth = labelsMethods.getPeriodLabelFromMetricPeriodMonthsFilter(
          "period month"
        );
        expect(incorrectPeriodMonth).toBe("Invalid date to present");
      });
    });

    describe("getTrailingLabelFromMetricPeriodMonthsFilter", () => {
      it("formats the trailing label for the time period correctly", () => {
        const periodMonth = labelsMethods.getTrailingLabelFromMetricPeriodMonthsFilter(
          5
        );
        expect(periodMonth).toBe("Last 0.4166666666666667 years");

        const emptyPeriodMonth = labelsMethods.getTrailingLabelFromMetricPeriodMonthsFilter(
          undefined
        );
        expect(emptyPeriodMonth).toBe("Last NaN years");

        const periodLastMonth = labelsMethods.getTrailingLabelFromMetricPeriodMonthsFilter(
          "12"
        );
        expect(periodLastMonth).toBe("Last 12 months");

        const periodCurrentMonth = labelsMethods.getTrailingLabelFromMetricPeriodMonthsFilter(
          "1"
        );
        expect(periodCurrentMonth).toBe("Current month");

        const period3Month = labelsMethods.getTrailingLabelFromMetricPeriodMonthsFilter(
          "3"
        );
        expect(period3Month).toBe("Last 3 months");

        const period6Month = labelsMethods.getTrailingLabelFromMetricPeriodMonthsFilter(
          "6"
        );
        expect(period6Month).toBe("Last 6 months");

        const period36Month = labelsMethods.getTrailingLabelFromMetricPeriodMonthsFilter(
          "36"
        );
        expect(period36Month).toBe("Last 3 years");
      });
    });

    it("correctly formats the officer label", () => {
      const officerLabel = "01 - BARNEY RUBBLE";
      const result = labelsMethods.formatOfficerLabel(officerLabel);
      expect(result).toEqual("01 - Barney Rubble");
    });

    it("returns an empty string when officer label is undefined", () => {
      const officerLabel = undefined;
      const result = labelsMethods.formatOfficerLabel(officerLabel);
      expect(result).toEqual("");
    });

    describe("#formatLargeNumber", () => {
      it("formats a number in the millions correctly", () => {
        const number = 2540001;
        const result = labelsMethods.formatLargeNumber(number);
        expect(result).toEqual("2.5M");
      });

      it("formats a number in the thousands correctly", () => {
        const number = 2501;
        const result = labelsMethods.formatLargeNumber(number);
        expect(result).toEqual("2,501");
      });

      it("formats a number in the hundreds correctly", () => {
        const number = 25;
        const result = labelsMethods.formatLargeNumber(number);
        expect(result).toEqual("25");
      });
    });
  });
});
