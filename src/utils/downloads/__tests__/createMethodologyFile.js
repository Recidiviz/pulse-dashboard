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

import createMethodologyFile from "../createMethodologyFile";

jest.mock("../../../utils/i18nSettings");
describe("createMethodologyFile functions", () => {
  const mockChartId = "revocations_count";
  const mockChartTitle = "Revocations Count";
  const mockTimeWindowDescription = "20 November 2019 - 20 November 2020";
  const mockMethodologyHeader = "methodology header";
  const mockMethodologyBody = "methodology body";
  const methodology = {
    [mockChartId]: [
      {
        header: mockMethodologyHeader,
        body: mockMethodologyBody,
      },
    ],
  };
  const filtersText = "some filters text";
  const violationText = "some violation text";

  const nowSpy = jest.spyOn(Date, "now");
  nowSpy.mockReturnValue(1605866733144);

  it("should return methodology file for MO", () => {
    const actual = createMethodologyFile(
      mockChartId,
      mockChartTitle,
      mockTimeWindowDescription,
      filtersText,
      methodology,
      violationText
    );

    expect(actual.data).toBe(
      "Chart: Revocations Count\n" +
        "Dates: 20 November 2019 - 20 November 2020\n" +
        "Applied filters:\n" +
        "- some filters text\n" +
        "- some violation text\n\n" +
        "Export Date: 11/20/2020\n\n" +
        "methodology header\n" +
        "methodology body\n\n"
    );
  });
});
