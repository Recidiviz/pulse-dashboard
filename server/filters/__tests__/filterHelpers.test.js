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
const { matchesAllFilters } = require("shared-filters");

const {
  createSubsetFilters,
  getFilterFnByMetricName,
} = require("../filterHelpers");

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
jest.mock("shared-filters/", () => {
  return {
    matchesAllFilters: jest.fn(),
    getFilterKeys: () => {
      return { METRIC_PERIOD_MONTHS: "metric_period_months" };
    },
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

describe("getFilterFnByMetricName", () => {
  afterAll(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  describe("given metricName=revocations_matrix_by_month", () => {
    const filters = {};
    const metricName = "revocations_matrix_by_month";

    it("matchesAllFilters is called with correct skippedFilters param", () => {
      getFilterFnByMetricName(metricName, filters);
      expect(matchesAllFilters).toHaveBeenCalledWith({
        filters,
        skippedFilters: ["metric_period_months"],
      });
    });
  });
});
