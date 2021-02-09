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
const {
  createFlattenedValueMatrix,
  createSubsetMetadata,
  getSubsetDimensionKeys,
  getSubsetDimensionValues,
} = require("../subsetFileHelpers");

jest.mock("../../constants/subsetManifest", () => {
  return {
    getSubsetManifest: jest.fn().mockImplementation(() => {
      return [
        [
          "violation_type",
          [
            ["all", "absconsion"],
            ["felony", "law"],
          ],
        ],
        ["charge_category", [["all", "domestic_violence"], ["sex_offense"]]],
      ];
    }),
  };
});

describe("subsetFileHelpers", () => {
  afterAll(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  describe("getSubsetDimensionKeys", () => {
    it("returns an array of the dimension keys in the subset manifest", () => {
      expect(getSubsetDimensionKeys()).toEqual([
        "violation_type",
        "charge_category",
      ]);
    });
  });

  describe("getSubsetDimensionValues", () => {
    it("given a value, it returns all of the subset values for the given dimension key", () => {
      expect(getSubsetDimensionValues("violation_type", "felony")).toEqual([
        "felony",
        "law",
      ]);
    });
    it("given an index, it returns all of the subset values for the given dimension key", () => {
      expect(getSubsetDimensionValues("violation_type", 0)).toEqual([
        "all",
        "absconsion",
      ]);
    });
  });

  describe("createSubsetMetadata", () => {
    const originalMetadata = {
      total_data_points: 100,
      value_keys: ["total_revocations"],
      dimension_manifest: [
        ["violation_type", ["all", "absconsion", "felony", "law"]],
        ["supervision_type", ["all", "dual", "parole", "probation"]],
      ],
    };
    const subsetFilters = {
      violation_type: ["felony", "law"],
    };
    const totalDataPoints = 10;

    it("creates a metadata object with new total_data_points and dimension_manifest from subsets", () => {
      expect(
        createSubsetMetadata(totalDataPoints, originalMetadata, subsetFilters)
      ).toEqual({
        ...originalMetadata,
        total_data_points: totalDataPoints,
        dimension_manifest: [
          ["violation_type", subsetFilters.violation_type],
          ["supervision_type", ["all", "dual", "parole", "probation"]],
        ],
      });
    });
  });

  describe("createFlattenedValueMatrix", () => {
    const filteredDataPoints = [
      {
        charge_category: "ALL",
        violation_type: "FELONY",
        total_revocations: 1,
      },
      { charge_category: "ALL", violation_type: "LAW", total_revocations: 2 },
      { charge_category: "ALL", violation_type: "LAW", total_revocations: 3 },
    ];
    const subsetMetadata = {
      total_data_points: filteredDataPoints.length,
      value_keys: ["total_revocations"],
      dimension_manifest: [
        ["violation_type", ["felony", "law"]],
        ["charge_category", ["all", "domestic_violence"]],
      ],
    };
    it("creates a flattened value matrix string", () => {
      expect(
        createFlattenedValueMatrix(filteredDataPoints, subsetMetadata)
      ).toEqual("0,1,1,0,0,0,1,2,3");
    });
  });
});
