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

const { default: getMetricsByType } = require("../getMetricsByType");
const { default: NewRevocationsMetrics } = require("../NewRevocationsMetrics");
const { default: BaseMetrics } = require("../BaseMetrics");
const { COLLECTIONS } = require("../../constants/collections");

describe("getMetricsByType", () => {
  test.each([
    ["US_MO", COLLECTIONS.NEW_REVOCATION, NewRevocationsMetrics],
    ["US_PA", COLLECTIONS.NEW_REVOCATION, NewRevocationsMetrics],
    ["US_DEMO", COLLECTIONS.NEW_REVOCATION, NewRevocationsMetrics],
    ["US_ND", COLLECTIONS.COMMUNITY_GOALS, BaseMetrics],
    ["US_ND", COLLECTIONS.COMMUNITY_EXPLORE, BaseMetrics],
    ["US_ND", COLLECTIONS.FACILITIES_GOALS, BaseMetrics],
    ["US_ND", COLLECTIONS.FACILITIES_EXPLORE, BaseMetrics],
    ["US_ND", COLLECTIONS.PROGRAMMING_EXPLORE, BaseMetrics],
  ])(
    "stateCode %s for metric %s returns a %p metric class",
    (stateCode, metricType, metricClass) => {
      expect(getMetricsByType(metricType, stateCode)).toBeInstanceOf(
        metricClass
      );
    }
  );

  it("throws an error for unknown metric types", () => {
    const metricType = "made up type";
    expect(() => getMetricsByType(metricType, "US_MO")).toThrowError(
      `No such metric type ${metricType} for US_MO`
    );
  });
});