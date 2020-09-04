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
  const returnedFileExtension = ".json";
  const returnedFiles = [returnedFile];
  const downloadFileResponse = "resolved value";
  const value_keys = "some value keys";
  const total_data_points = "some total data points";
  const dimension_manifest = "some dimension manifest";
  const downloadFileMetadataResponse = [
    {
      metadata: {
        value_keys: JSON.stringify(value_keys),
        total_data_points: total_data_points,
        dimension_manifest: JSON.stringify(dimension_manifest),
      },
    },
  ];

  it("should return array with data and metadata", () => {
    getFilesByMetricType.mockImplementation(() => returnedFiles);

    const downloadFileSpy = jest.spyOn(objectStorage, "downloadFile");
    const downloadFileMetadataSpy = jest.spyOn(
      objectStorage,
      "downloadFileMetadata"
    );
    downloadFileSpy.mockReturnValue(Promise.resolve(downloadFileResponse));
    downloadFileMetadataSpy.mockReturnValue(
      Promise.resolve(downloadFileMetadataResponse)
    );

    fetchMetricsFromGCS(stateCode, metricType, file).forEach((promise) => {
      expect(promise).resolves.toStrictEqual({
        contents: downloadFileResponse,
        fileKey: returnedFileKey,
        extension: returnedFileExtension,
        metadata: {
          value_keys,
          total_data_points,
          dimension_manifest,
        },
      });
    });

    expect(downloadFileSpy).toHaveBeenCalledTimes(1);
    expect(downloadFileMetadataSpy).toHaveBeenCalledTimes(1);
  });

  it("should return array with data and without metadata", () => {
    getFilesByMetricType.mockImplementation(() => returnedFiles);

    const downloadFileSpy = jest.spyOn(objectStorage, "downloadFile");
    const downloadFileMetadataSpy = jest.spyOn(
      objectStorage,
      "downloadFileMetadata"
    );
    downloadFileSpy.mockReturnValue(Promise.resolve(downloadFileResponse));
    downloadFileMetadataSpy.mockReturnValue(Promise.resolve([]));

    fetchMetricsFromGCS(stateCode, metricType, file).forEach((promise) => {
      expect(promise).resolves.toStrictEqual({
        contents: downloadFileResponse,
        fileKey: returnedFileKey,
        extension: returnedFileExtension,
        metadata: {},
      });
    });
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
