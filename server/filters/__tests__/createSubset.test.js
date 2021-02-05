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

const { default: createSubset } = require("../createSubset");

const violationTypeFilters = ["felony", "law", "misdemeanor"];
const chargeCategoryFilters = ["sex_offense"];

jest.mock("../../constants/subsetManifest", () => {
  return {
    getSubsetManifest: jest.fn().mockImplementation(() => {
      return [
        [
          "violation_type",
          [
            ["all", "absconded"],
            ["felony", "law"],
          ],
        ],
        ["charge_category", [["all", "general"], ["sex_offense"]]],
      ];
    }),
    FILES_WITH_SUBSETS: ["revocations_matrix_distribution_by_district"],
  };
});

describe("createSubset", () => {
  let fileKey;
  let metricFile;
  let output;
  let expectedFilteredValues;
  let expectedMetadata;

  afterAll(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  describe("Given a file without subsets", () => {
    it("does not filter the metric file", () => {
      fileKey = "not_in_the_subset_manifest";
      metricFile = { [fileKey]: "lots of great data" };
      expect(createSubset(fileKey, {}, metricFile)).toEqual(metricFile);
    });
  });

  describe("Given an optimized data format", () => {
    beforeEach(() => {
      fileKey = "revocations_matrix_distribution_by_district";
      const chargeCategoryValues = "2,2,2,2,2";
      const violationTypeValues = "0,1,2,2,2";
      const supervisionTypeValues = "0,0,1,1,0";
      const valueValues = "10,10,10,10,10";
      const subsetFilters = {
        violation_type: violationTypeFilters,
        charge_category: chargeCategoryFilters,
      };
      metricFile = {
        [fileKey]: {
          flattenedValueMatrix: [
            chargeCategoryValues,
            violationTypeValues,
            supervisionTypeValues,
            valueValues,
          ].join(","),
          metadata: {
            total_data_points: "5",
            dimension_manifest: [
              ["charge_category", ["all", "general", "sex_offense"]],
              [
                "violation_type",
                ["all", "absconded", "felony", "law", "misdemeanor"],
              ],
              ["supervision_type", ["all", "dual", "parole", "probation"]],
            ],
            value_keys: ["total_revocations"],
          },
        },
      };
      expectedMetadata = {
        total_data_points: 3,
        dimension_manifest: [
          ["charge_category", ["sex_offense"]],
          ["violation_type", ["felony", "law", "misdemeanor"]],
          ["supervision_type", ["all", "dual", "parole", "probation"]],
        ],
        value_keys: ["total_revocations"],
      };
      expectedFilteredValues = "0,0,0,0,0,0,1,1,0,10,10,10";
      output = createSubset(fileKey, subsetFilters, metricFile);
    });

    it("returns a metric file in the expected format", () => {
      expect(output).toHaveProperty(fileKey);
      expect(output[fileKey]).toHaveProperty("flattenedValueMatrix");
      expect(output[fileKey]).toHaveProperty("metadata");
      expect(output[fileKey]).toHaveProperty("metadata.total_data_points");
      expect(output[fileKey]).toHaveProperty("metadata.dimension_manifest");
      expect(output[fileKey]).toHaveProperty("metadata.value_keys");
    });

    it("returns a transformed metadata to reflect the subsets", () => {
      expect(output[fileKey].metadata).toEqual(expectedMetadata);
    });

    it("returns a filtered dataset as a flattenedValueMatrix", () => {
      expect(output[fileKey].flattenedValueMatrix).toEqual(
        expectedFilteredValues
      );
    });
  });

  describe("Given a metric file with JSON data points", () => {
    beforeEach(() => {
      fileKey = "revocations_matrix_distribution_by_district";
      const subsetFilters = {
        violation_type: violationTypeFilters,
        charge_category: chargeCategoryFilters,
      };
      metricFile = {
        [fileKey]: [
          {
            charge_category: "sex_offense",
            violation_type: "felony",
            supervision_type: "dual",
          },
          {
            charge_category: "sex_offense",
            violation_type: "felony",
            supervision_type: "probation",
          },
          {
            charge_category: "general",
            violation_type: "law",
            supervision_type: "parole",
          },
          {
            charge_category: "all",
            violation_type: "absconded",
            supervision_type: "all",
          },
        ],
      };
      expectedMetadata = {
        total_data_points: 2,
        dimension_manifest: [
          ["violation_type", ["felony", "law", "misdemeanor"]],
          ["charge_category", ["sex_offense"]],
        ],
      };
      expectedFilteredValues = [metricFile[fileKey][0], metricFile[fileKey][1]];
      output = createSubset(fileKey, subsetFilters, metricFile);
    });

    it("returns a metric file in the expected format", () => {
      expect(output).toHaveProperty(fileKey);
      expect(output[fileKey]).toHaveProperty("data");
      expect(output[fileKey]).toHaveProperty("metadata");
      expect(output[fileKey]).toHaveProperty("metadata.total_data_points");
      expect(output[fileKey]).toHaveProperty("metadata.dimension_manifest");
    });

    it("returns a transformed metadata to reflect the subsets", () => {
      expect(output[fileKey].metadata).toEqual(expectedMetadata);
    });

    it("returns a filtered dataset in the expanded format", () => {
      expect(output[fileKey].data).toEqual(expectedFilteredValues);
    });
  });
});
