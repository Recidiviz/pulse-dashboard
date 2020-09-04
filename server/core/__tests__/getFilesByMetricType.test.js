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

const {
  getFilesByMetricType,
  FILES_BY_METRIC_TYPE,
} = require("../getFilesByMetricType");

describe("getFilesByMetricType tests", () => {
  const [firstMetricType] = Object.keys(FILES_BY_METRIC_TYPE);
  const filesMatchingFirstMetricType = FILES_BY_METRIC_TYPE[firstMetricType];

  it("should return file names for metricType", () => {
    expect(getFilesByMetricType(firstMetricType)).toStrictEqual(
      filesMatchingFirstMetricType
    );
  });

  it("should return array with single file name", () => {
    const fileName = filesMatchingFirstMetricType[0].replace(".json", "");
    expect(getFilesByMetricType(firstMetricType, fileName)).toEqual([
      filesMatchingFirstMetricType[0],
    ]);
  });

  it("should throw error if there is no corresponding metricType", () => {
    const metricType = "random metric type that is not real case";
    expect(() => getFilesByMetricType(metricType)).toThrow(Error);
  });

  it("should throw error if there is no corresponding file", () => {
    const fileName = "random file name that is not real case";
    expect(() => getFilesByMetricType(firstMetricType, fileName)).toThrow(
      Error
    );
  });
});
