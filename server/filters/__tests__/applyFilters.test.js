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

const { default: applyFilters } = require("../applyFilters");

const violationTypeFilters = ["felony", "law", "misdemeanor"];
const chargeCategoryFilters = ["sex_offense"];

const mockGetFilterFnByFile = jest
  .fn()
  .mockImplementation((item, dimensionKey) => {
    return [...violationTypeFilters, ...chargeCategoryFilters].includes(
      item[dimensionKey].toLowerCase()
    );
  });

jest.mock("../filterHelpers", () => {
  return {
    getFilterFnByFile: () => mockGetFilterFnByFile,
  };
});

describe("applyFilters", () => {
  let fileKey;
  let metricFile;

  describe("Given a file without subsets", () => {
    it("does not filter the metric file", () => {
      metricFile = "lots of great data";
      fileKey = "not_in_the_subset_manifest";
      expect(applyFilters(fileKey, {}, metricFile)).toEqual(metricFile);
    });
  });

  describe("Given a file with subsets", () => {
    let output;
    let expectedFilteredValues;
    let expectedMetadata;

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
                ["all", "absconsion", "felony", "law", "misdemeanor"],
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
      output = applyFilters(fileKey, subsetFilters, metricFile);
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
});
