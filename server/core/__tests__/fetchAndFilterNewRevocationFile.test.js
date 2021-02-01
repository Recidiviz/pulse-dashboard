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
const { applyFilters, transformFilters } = require("../../filters");

const mockMetricFiles = { file_1: "content_1" };
const mockTransformedFilters = { violation_type: "All" };

jest.mock("../../core/fetchMetrics", () => {
  return {
    default: jest.fn(() => Promise.resolve(mockMetricFiles)),
  };
});
jest.mock("../../filters", () => {
  return {
    applyFilters: jest.fn(),
    transformFilters: jest.fn(() => mockTransformedFilters),
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
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    fetchAndFilterNewRevocationFile({
      file,
      queryParams,
      ...fetchArgs,
    });
    transformFilters.mockImplementationOnce(() => mockTransformedFilters);
  });

  it("calls fetchMetrics with the correct args", async () => {
    expect(fetchMetrics).toHaveBeenCalledWith(
      stateCode,
      metricType,
      file,
      isDemoMode
    );
  });

  it("calls transformFilters with the correct args", () => {
    expect(transformFilters).toHaveBeenCalledWith({
      filters: queryParams,
    });
  });

  it("calls applyFilters with the correct args", async () => {
    expect(applyFilters).toHaveBeenCalledWith(
      file,
      mockTransformedFilters,
      mockMetricFiles
    );
  });
});
