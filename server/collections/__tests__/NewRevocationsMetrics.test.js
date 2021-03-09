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

const { default: NewRevocationsMetrics } = require("../NewRevocationsMetrics");
const {
  DEFAULT_METRIC_PERIOD_MONTHS,
} = require("../resources/dimensionValues/shared");
const { COLLECTIONS } = require("../../constants/collections");

describe("NewRevocationsMetrics", () => {
  const stateCode = "US_MO";
  const fileName = "revocations_matrix_cells";
  let metric;

  beforeEach(() => {
    metric = new NewRevocationsMetrics(COLLECTIONS.NEW_REVOCATION, stateCode);
  });

  it("throws an error if instantiated with wrong metric type", () => {
    expect(
      () => new NewRevocationsMetrics(COLLECTIONS.COMMUNITY_EXPLORE, stateCode)
    ).toThrowError(
      `Incorrect metricType for metric class NewRevocationsMetrics: ${COLLECTIONS.COMMUNITY_EXPLORE}`
    );
  });

  describe("validateDimensionsForFile", () => {
    it("does not throw an error for valid dimension values", () => {
      const sourceDimensions = [
        "metric_period_months",
        DEFAULT_METRIC_PERIOD_MONTHS,
      ];
      expect(() =>
        metric.validateDimensionsForFile(fileName, sourceDimensions)
      ).not.toThrow();
    });

    it("throws an error for invalid dimension values", () => {
      const sourceDimensions = [
        ["metric_period_months", DEFAULT_METRIC_PERIOD_MONTHS.concat(["16"])],
      ];

      expect(() =>
        metric.validateDimensionsForFile(fileName, sourceDimensions)
      ).toThrowError(
        new Error(
          `${fileName} includes unexpected dimension values: metric_period_months: 16`
        )
      );
    });

    it("does not throw an error for missing dimension value", () => {
      const sourceDimensions = [["metric_period_months", ["12", "6"]]];

      expect(() =>
        metric.validateDimensionsForFile(fileName, sourceDimensions)
      ).not.toThrow();
    });
  });
});
