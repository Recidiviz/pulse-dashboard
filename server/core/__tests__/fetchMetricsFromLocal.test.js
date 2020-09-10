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

const fs = require("fs");
const path = require("path");
const { default: fetchMetricsFromLocal } = require("../fetchMetricsFromLocal");
const { getFilesByMetricType } = require("../getFilesByMetricType");

jest.mock("../getFilesByMetricType", () => ({
  getFilesByMetricType: jest.fn(),
}));
jest.mock("fs");

describe("fetchMetricsFromLocal tests", () => {
  const stateCode = "some code";
  const metricType = "some type";
  const file = "some file";

  const promiseResValue = "resolved value";
  const metadata = "some metadata";

  it("should return array with resolving promises without metadata", () => {
    const returnedFile = "some_file.json";
    const returnedFileKey = "some_file";
    const returnedFileExtension = ".json";
    const returnedFiles = [returnedFile];
    getFilesByMetricType.mockImplementation(() => returnedFiles);

    jest.spyOn(path, "resolve");
    const readFileSpy = jest.spyOn(fs, "readFile");
    const readFileSyncSpy = jest.spyOn(fs, "readFileSync");
    readFileSpy.mockImplementation((_, callback) =>
      callback(null, promiseResValue)
    );
    readFileSyncSpy.mockReturnValue(JSON.stringify(metadata));

    fetchMetricsFromLocal(stateCode, metricType, file).forEach((promise) => {
      expect(promise).resolves.toStrictEqual({
        contents: promiseResValue,
        fileKey: returnedFileKey,
        metadata: {},
        extension: returnedFileExtension,
      });
    });
  });

  it("should return array with resolving promises with metadata", () => {
    const returnedFileKey = "some_file";
    const returnedFile = "some_file.txt";
    const returnedFileExtension = ".txt";
    const returnedFiles = [returnedFile];
    getFilesByMetricType.mockImplementation(() => returnedFiles);

    jest.spyOn(path, "resolve");
    const readFileSpy = jest.spyOn(fs, "readFile");
    const readFileSyncSpy = jest.spyOn(fs, "readFileSync");
    readFileSpy.mockImplementation((_, callback) =>
      callback(null, promiseResValue)
    );
    readFileSyncSpy.mockReturnValue(JSON.stringify(metadata));

    fetchMetricsFromLocal(stateCode, metricType, file).forEach((promise) => {
      expect(promise).resolves.toStrictEqual({
        contents: promiseResValue,
        fileKey: returnedFileKey,
        metadata,
        extension: returnedFileExtension,
      });
    });
  });

  it("should return array with rejected promises", () => {
    const error = new Error("some error");
    getFilesByMetricType.mockImplementation(() => {
      throw error;
    });

    fetchMetricsFromLocal(stateCode, metricType, file).forEach((promise) => {
      expect(promise).rejects.toStrictEqual(error);
    });
  });
});
