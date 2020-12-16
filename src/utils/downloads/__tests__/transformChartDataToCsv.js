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
import transformChartDataToCsv from "../transformChartDataToCsv";

describe("transformChartDataToCsv", () => {
  const exportLabel = "Export Label";
  describe("when labels count more than datasets count should place labels in rows", () => {
    const datasets = [
      {
        label: "Revocations",
        data: [1, 2, 6, 8],
      },
    ];
    const labels = ["Low", "Medium", "High", "Not assessed"];

    it("standard case", async () => {
      expect(
        await transformChartDataToCsv(datasets, labels, exportLabel)
      ).toEqual(
        `Export Label,Revocations\nLow,1\nMedium,2\nHigh,6\nNot assessed,8`
      );
    });

    it("should not export trendline", async () => {
      expect(
        await transformChartDataToCsv(
          datasets.concat([
            {
              label: "trendline",
              data: [2, 3, 4, 6],
            },
          ]),
          labels,
          exportLabel
        )
      ).toEqual(
        `Export Label,Revocations\nLow,1\nMedium,2\nHigh,6\nNot assessed,8`
      );
    });
  });

  describe("when datasets count more than labels count or it is table should place labels in columns", () => {
    const datasets = [
      {
        label: "Women",
        data: [1, 2, 6],
      },
      {
        label: "Men",
        data: [2, 4, 6],
      },
      {
        label: "Dog",
        data: [3, 3, 4],
      },
      {
        label: "Cat",
        data: [1, 6, 8],
      },
    ];
    const labels = ["Low", "Medium", "High"];

    it("datasets more than labels", async () => {
      expect(
        await transformChartDataToCsv(datasets, labels, exportLabel)
      ).toEqual(
        `Export Label,Low,Medium,High\nWomen,1,2,6\nMen,2,4,6\nDog,3,3,4\nCat,1,6,8`
      );
    });

    it("fixLabelsInColumns = true", async () => {
      expect(
        await transformChartDataToCsv(
          [
            { data: [1, 2, 6] },
            { data: [2, 4, 6] },
            { data: [3, 3, 4] },
            { data: [1, 6, 8] },
          ],
          labels,
          false,
          true
        )
      ).toEqual(`Low,Medium,High\n1,2,6\n2,4,6\n3,3,4\n1,6,8`);
    });
  });
});
