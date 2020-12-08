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

    it("standard case", () => {
      expect(
        transformChartDataToCsv(datasets, labels, exportLabel)
      ).resolves.toEqual(
        `Export Label,Revocations\nLow,1\nMedium,2\nHigh,6\nNot assessed,8`
      );
    });

    it("should not export trendline", () => {
      expect(
        transformChartDataToCsv(
          datasets.concat([
            {
              label: "trendline",
              data: [2, 3, 4, 6],
            },
          ]),
          labels,
          exportLabel
        )
      ).resolves.toEqual(
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

    it("datasets more than labels", () => {
      expect(
        transformChartDataToCsv(datasets, labels, exportLabel)
      ).resolves.toEqual(
        `Export Label,Low,Medium,High\nWomen,1,2,6\nMen,2,4,6\nDog,3,3,4\nCat,1,6,8`
      );
    });

    it("fixLabelsInColumns = true", () => {
      expect(
        transformChartDataToCsv(
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
      ).resolves.toEqual(`Low,Medium,High\n1,2,6\n2,4,6\n3,3,4\n1,6,8`);
    });
  });
});
