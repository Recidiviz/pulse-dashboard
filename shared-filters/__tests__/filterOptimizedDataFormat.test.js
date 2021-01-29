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

const { filterOptimizedDataFormat } = require("../filterOptimizedDataFormat");

describe("filterOptimizedDataFormat", () => {
  const metadata = {
    total_data_points: "11",
    value_keys: ["total_revocations"],
    dimension_manifest: [
      ["district", ["4", "5", "6"]],
      ["month", ["11", "12"]],
      ["supervision_type", ["parole", "probation"]],
      ["year", ["2020"]],
    ],
  };

  const unflattenedMatrix = [
    ["0", "0", "1", "1", "2", "0", "0", "1", "1", "2", "2"],
    ["0", "0", "0", "0", "0", "1", "1", "1", "1", "1", "1"],
    ["0", "1", "0", "1", "0", "0", "1", "0", "1", "0", "1"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["100", "68", "73", "41", "10", "30", "36", "51", "38", "15", "4"],
  ];
  const fullOutput = [
    {
      district: "4",
      year: "2020",
      month: "11",
      supervision_type: "PAROLE",
      total_revocations: "100",
    },
    {
      district: "4",
      year: "2020",
      month: "11",
      supervision_type: "PROBATION",
      total_revocations: "68",
    },
    {
      district: "5",
      year: "2020",
      month: "11",
      supervision_type: "PAROLE",
      total_revocations: "73",
    },
    {
      district: "5",
      year: "2020",
      month: "11",
      supervision_type: "PROBATION",
      total_revocations: "41",
    },
    {
      district: "6",
      year: "2020",
      month: "11",
      supervision_type: "PAROLE",
      total_revocations: "10",
    },
    {
      district: "4",
      year: "2020",
      month: "12",
      supervision_type: "PAROLE",
      total_revocations: "30",
    },
    {
      district: "4",
      year: "2020",
      month: "12",
      supervision_type: "PROBATION",
      total_revocations: "36",
    },
    {
      district: "5",
      year: "2020",
      month: "12",
      supervision_type: "PAROLE",
      total_revocations: "51",
    },
    {
      district: "5",
      year: "2020",
      month: "12",
      supervision_type: "PROBATION",
      total_revocations: "38",
    },
    {
      district: "6",
      year: "2020",
      month: "12",
      supervision_type: "PAROLE",
      total_revocations: "15",
    },
    {
      district: "6",
      year: "2020",
      month: "12",
      supervision_type: "PROBATION",
      total_revocations: "4",
    },
  ];

  describe("given an unflattenedMatrix", () => {
    it("correctly parses data points, regardless of filtering", () => {
      const filtered = filterOptimizedDataFormat(
        unflattenedMatrix,
        metadata,
        () => true
      );
      expect(filtered).toEqual(fullOutput);
    });

    it("correctly parses and filters data points", () => {
      const filtered = filterOptimizedDataFormat(
        unflattenedMatrix,
        metadata,
        (item, dimensionKey) =>
          dimensionKey !== "supervision_type" ||
          item.supervision_type.toUpperCase() === "PAROLE"
      );

      const expected = [
        fullOutput[0],
        fullOutput[2],
        fullOutput[4],
        fullOutput[5],
        fullOutput[7],
        fullOutput[9],
      ];
      expect(filtered).toEqual(expected);
    });

    it("correctly parses and filters data points with multiple filters", () => {
      const filterFn = (item, dimensionKey) => {
        if (dimensionKey === "supervision_type") {
          return item.supervision_type.toUpperCase() === "PAROLE";
        }
        if (dimensionKey === "month") {
          return item.month === "11";
        }
        return true;
      };
      const filtered = filterOptimizedDataFormat(
        unflattenedMatrix,
        metadata,
        filterFn
      );

      const expected = [fullOutput[0], fullOutput[2], fullOutput[4]];
      expect(filtered).toEqual(expected);
    });

    it("correctly returns an empty list with a falsey filter", () => {
      const filtered = filterOptimizedDataFormat(
        unflattenedMatrix,
        metadata,
        () => false
      );

      expect(filtered).toEqual([]);
    });
  });

  describe("given a skipFilterFn that returns true", () => {
    it("does not filter data based on the skipped dimension key", () => {
      const filterFn = (item, dimensionKey) => {
        if (dimensionKey === "supervision_type") {
          return item.supervision_type.toUpperCase() === "PAROLE";
        }
        if (dimensionKey === "month") {
          return item.month === "11";
        }
        return true;
      };

      const skipFilterFn = (dimensionKey) => dimensionKey === "month";

      const filtered = filterOptimizedDataFormat(
        unflattenedMatrix,
        metadata,
        filterFn,
        skipFilterFn
      );

      expect(filtered).toEqual([
        fullOutput[0],
        fullOutput[2],
        fullOutput[4],
        fullOutput[5],
        fullOutput[7],
        fullOutput[9],
      ]);
    });
  });

  describe("when unflattenedMatrix not a nested array", () => {
    it("throws an error", () => {
      expect(() => filterOptimizedDataFormat([])).toThrowError(
        new Error(
          `Invalid data type supplied to filterOptimizedDataFormat, expected 2D array of values.`
        )
      );
    });
  });
});
