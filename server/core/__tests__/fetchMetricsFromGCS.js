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

const { default: fetchMetricsFromGCS } = require("../fetchMetricsFromGCS");
const { getFilesByMetricType } = require("../getFilesByMetricType");
const objectStorage = require("../objectStorage");

jest.mock("../getFilesByMetricType", () => ({
  getFilesByMetricType: jest.fn(),
}));
jest.mock("../objectStorage");

describe("fetchMetricsFromGCS tests", () => {
  const stateCode = "some code";
  const metricType = "some type";
  const file = "some file";

  const returnedFile = "some_file.json";
  const returnedFileKey = "some_file";
  const returnedFiles = [returnedFile];
  const promiseResValue = "resolved value";

  it("should return array with resolving promises", () => {
    getFilesByMetricType.mockImplementation(() => returnedFiles);

    const downloadFileSpy = jest.spyOn(objectStorage, "downloadFile");
    downloadFileSpy.mockReturnValue(Promise.resolve(promiseResValue));

    fetchMetricsFromGCS(stateCode, metricType, file).forEach((promise) => {
      expect(promise).resolves.toStrictEqual({
        contents: promiseResValue,
        fileKey: returnedFileKey,
      });
    });

    expect(downloadFileSpy.mock.calls.length).toBe(1);
  });

  it("should return array with rejected promises", () => {
    const error = new Error("some error");
    getFilesByMetricType.mockImplementation(() => {
      throw error;
    });

    fetchMetricsFromGCS(stateCode, metricType, file).forEach((promise) => {
      expect(promise).rejects.toStrictEqual(error);
    });
  });
});
