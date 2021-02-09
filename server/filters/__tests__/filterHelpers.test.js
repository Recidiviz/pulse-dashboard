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
const { createSubsetFilters, getFilterFnByFile } = require("../filterHelpers");
const { matchesAllFilters } = require("../../../shared-filters/dataFilters");

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
    FILES_WITH_SUBSETS: ["revocations_matrix_distribution_by_district"],
  };
});
jest.mock("../../../shared-filters/dataFilters", () => {
  return {
    matchesAllFilters: jest.fn(),
  };
});

describe("createSubsetFilters", () => {
  afterAll(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  describe("Given a filters object with filter values", () => {
    const filters = {
      violationType: "FELONY",
      chargeCategory: "DOMESTIC_VIOLENCE",
    };
    it("replaces the filter value with an array of values from the subset manifest", () => {
      expect(createSubsetFilters({ filters })).toEqual({
        violation_type: ["felony", "law"],
        charge_category: ["all", "domestic_violence"],
      });
    });

    it("does not include filter values that are not in the subset manifest", () => {
      filters.supervisionType = "DUAL";
      expect(createSubsetFilters({ filters })).toEqual({
        violation_type: ["felony", "law"],
        charge_category: ["all", "domestic_violence"],
      });
    });
  });

  describe("Given a filters object with index values", () => {
    const filters = {
      violation_type: 0,
      charge_category: 1,
    };
    it("replaces the filter value with an array of values from the subset manifest", () => {
      expect(createSubsetFilters({ filters })).toEqual({
        violation_type: ["all", "absconsion"],
        charge_category: ["sex_offense"],
      });
    });
  });
});

describe("getFilterFnByFile", () => {
  afterAll(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  describe("given file=revocations_matrix_by_month", () => {
    const filters = {};
    const file = "revocations_matrix_by_month";

    it("matchesAllFilters is called with correct skippedFilters param", () => {
      getFilterFnByFile(file, filters);
      expect(matchesAllFilters).toHaveBeenCalledWith({
        filters,
        skippedFilters: ["metric_period_months"],
      });
    });
  });
});
