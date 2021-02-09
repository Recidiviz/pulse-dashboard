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

const { fetchAndFilterNewRevocationFile } = require("..");
const { default: fetchMetrics } = require("../fetchMetrics");
const { createSubset, createSubsetFilters } = require("../../filters");

const mockMetricFiles = { file_1: "content_1" };
const mockSubsetFilters = {
  violation_type: [
    "absconded",
    "all",
    "elec_monitoring",
    "escaped",
    "high_tech",
    "low_tech",
    "med_tech",
    "municipal",
    "no_violation_type",
    "substance_abuse",
    "technical",
  ],
  charge_category: [
    "all",
    "domestic_violence",
    "general",
    "serious_mental_illness",
  ],
};

jest.mock("../../core/fetchMetrics", () => {
  return {
    default: jest.fn(() => Promise.resolve(mockMetricFiles)),
  };
});
jest.mock("../../filters", () => {
  return {
    createSubset: jest.fn(),
    createSubsetFilters: jest.fn(() => mockSubsetFilters),
  };
});

describe("fetchAndFilterNewRevocationFile", () => {
  const file = "file_1";
  const metricType = "newRevocationFile";
  const queryParams = { violationType: "All" };
  const isDemoMode = false;
  const stateCode = "TEST_ID";
  const fetchArgs = { stateCode, metricType, isDemoMode };

  afterAll(() => {
    jest.resetModules();
  });

  beforeEach(() => {
    fetchAndFilterNewRevocationFile({
      file,
      queryParams,
      ...fetchArgs,
    });
  });

  it("calls fetchMetrics with the correct args", async () => {
    expect(fetchMetrics).toHaveBeenCalledWith(
      stateCode,
      metricType,
      file,
      isDemoMode
    );
  });

  it("calls createSubsetFilters with the correct args", () => {
    expect(createSubsetFilters).toHaveBeenCalledWith({
      filters: queryParams,
    });
  });

  it("calls createSubset with the correct args", async () => {
    expect(createSubset).toHaveBeenCalledWith(
      file,
      mockSubsetFilters,
      mockMetricFiles
    );
  });
});
