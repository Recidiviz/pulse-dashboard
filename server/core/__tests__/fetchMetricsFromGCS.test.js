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
const getMetricsByType = require("../../collections/getMetricsByType");
const objectStorage = require("../objectStorage");

jest.mock("../../models/getMetricsByType");

jest.mock("../objectStorage");

describe("fetchMetricsFromGCS tests", () => {
  const stateCode = "US_MO";
  const metricType = "newRevocation";
  const file = "revocations_matrix_by_month";

  const returnedFile = "revocations_matrix_by_month.json";
  const returnedFileKey = "revocations_matrix_by_month";
  const returnedFileExtension = ".json";
  const fileUpdatedAt = "Fri, 31 Oct 2020 00:39:20 GMT";
  const mockReturnedFiles = [returnedFile];
  const downloadFileResponse = "resolved value";
  const valueKeys = "some value keys";
  const totalDataPoints = "some total data points";
  const dimensionManifest = "some dimension manifest";
  const downloadFileMetadataResponse = [
    {
      updated: fileUpdatedAt,
      metadata: {
        value_keys: JSON.stringify(valueKeys),
        total_data_points: totalDataPoints,
        dimension_manifest: JSON.stringify(dimensionManifest),
      },
    },
  ];

  const downloadFileSpy = jest.spyOn(objectStorage, "downloadFile");
  const downloadFileMetadataSpy = jest.spyOn(
    objectStorage,
    "downloadFileMetadata"
  );

  it("files with metadata should return array with data and metadata", async () => {
    getMetricsByType.default.mockImplementation(() => {
      return {
        getFiles: jest.fn().mockReturnValue(mockReturnedFiles),
        validateDimensionsForFile: () => true,
      };
    });
    downloadFileSpy.mockResolvedValue(downloadFileResponse);
    downloadFileMetadataSpy.mockResolvedValue(downloadFileMetadataResponse);

    const fetchPromises = Promise.all(
      fetchMetricsFromGCS(stateCode, metricType, file)
    );

    await expect(fetchPromises).resolves.toStrictEqual([
      {
        contents: downloadFileResponse,
        fileKey: returnedFileKey,
        extension: returnedFileExtension,
        metadata: {
          updated: "Fri, 31 Oct 2020 00:39:20 GMT",
          value_keys: valueKeys,
          total_data_points: totalDataPoints,
          dimension_manifest: dimensionManifest,
        },
      },
    ]);

    expect(downloadFileSpy).toHaveBeenCalledTimes(1);
    expect(downloadFileMetadataSpy).toHaveBeenCalledTimes(1);
    expect.assertions(3);
  });

  it("files without metadata should return array with data", async () => {
    getMetricsByType.default.mockImplementation(() => {
      return {
        getFiles: jest.fn().mockReturnValue(mockReturnedFiles),
        validateDimensionsForFile: () => true,
      };
    });

    downloadFileSpy.mockResolvedValue(downloadFileResponse);
    downloadFileMetadataSpy.mockResolvedValue([]);

    const fetchPromises = Promise.all(
      fetchMetricsFromGCS(stateCode, metricType, file)
    );

    await expect(fetchPromises).resolves.toStrictEqual([
      {
        contents: downloadFileResponse,
        fileKey: returnedFileKey,
        extension: returnedFileExtension,
        metadata: {},
      },
    ]);

    expect.assertions(1);
  });

  describe("when there's an error", () => {
    beforeEach(() => {
      jest.restoreAllMocks();
      jest.resetAllMocks();
    });

    it("errors getting files returns an array with rejected promises", async () => {
      const error = new Error("getFiles error");
      getMetricsByType.default.mockImplementationOnce(() => {
        return {
          getFiles: () => {
            throw error;
          },
        };
      });

      const fetchPromises = Promise.all(
        fetchMetricsFromGCS(stateCode, metricType, file)
      );

      await expect(fetchPromises).rejects.toEqual(error);

      expect.assertions(1);
    });

    it("errors downloading files returns an array with rejected promises", async () => {
      const error = new Error("downloadFile error");

      getMetricsByType.default.mockImplementationOnce(() => {
        return {
          getFiles: jest.fn().mockReturnValue(mockReturnedFiles),
        };
      });
      downloadFileSpy.mockImplementationOnce(() => {
        throw error;
      });

      const fetchPromises = Promise.all(
        fetchMetricsFromGCS(stateCode, metricType, file)
      );

      await expect(fetchPromises).rejects.toEqual(error);

      expect.assertions(1);
    });

    it("errors validating dimensions returns an array with rejected promises", async () => {
      const error = new Error("Error validating dimensions!");
      downloadFileSpy.mockResolvedValue(downloadFileResponse);
      downloadFileMetadataSpy.mockResolvedValue([]);
      getMetricsByType.default.mockImplementationOnce(() => {
        return {
          getFiles: jest.fn().mockReturnValue(mockReturnedFiles),
          validateDimensionsForFile: () => {
            throw error;
          },
        };
      });

      const fetchPromises = Promise.all(
        fetchMetricsFromGCS(stateCode, metricType, file)
      );

      await expect(fetchPromises).rejects.toEqual(error);

      expect.assertions(1);
    });
  });
});
