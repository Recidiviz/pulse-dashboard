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
const { createSubset } = require("../../filters");

const mockMetricFiles = { file_1: "content_1" };

jest.mock("../../core/fetchMetrics", () => {
  return {
    default: jest.fn(() => Promise.resolve(mockMetricFiles)),
  };
});
jest.mock("../../filters", () => {
  return {
    createSubset: jest.fn(),
  };
});

describe("fetchAndFilterNewRevocationFile", () => {
  const metricName = "file_1";
  const metricType = "newRevocationFile";
  const filters = {
    violation_type: [
      "all",
      "elec_monitoring",
      "escaped",
      "low_tech",
      "med_tech",
      "municipal",
      "no_violation_type",
      "technical",
    ],
  };
  const isDemoMode = false;
  const stateCode = "TEST_ID";
  const fetchArgs = { stateCode, metricType, isDemoMode };

  afterAll(() => {
    jest.resetModules();
  });

  beforeEach(() => {
    fetchAndFilterNewRevocationFile({
      metricName,
      filters,
      ...fetchArgs,
    });
  });

  it("calls fetchMetrics with the correct args", () => {
    expect(fetchMetrics).toHaveBeenCalledWith(
      stateCode,
      metricType,
      metricName,
      isDemoMode
    );
    expect.hasAssertions();
  });

  it("calls createSubset with the correct args", () => {
    expect(createSubset).toHaveBeenCalledWith(
      metricName,
      filters,
      mockMetricFiles
    );
    expect.hasAssertions();
  });
});
