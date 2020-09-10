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

const { fetchMetrics } = require("../");
const { default: processMetricFile } = require("../processMetricFile");
const { default: fetchMetricsFromLocal } = require("../fetchMetricsFromLocal");
const { default: fetchMetricsFromGCS } = require("../fetchMetricsFromGCS");

jest.mock("../processMetricFile");
jest.mock("../fetchMetricsFromLocal");
jest.mock("../fetchMetricsFromGCS");

describe("fetchMetrics tests", () => {
  const stateCode = "demo_code";
  const upperCasedStateCode = "DEMO_CODE";
  const file = "file";
  const fileKey = "some key";
  const contents = "some file contents";
  const metadata = "some metadata";
  const extension = "some extension";
  const promiseData = {
    contents,
    metadata,
    extension,
    fileKey,
  };
  const deserializedFile = "some deserialized file";
  const error = new Error("some error");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully process response with local data", (done) => {
    const metricType = "metric_type";
    const isDemo = true;
    fetchMetricsFromLocal.mockReturnValue([Promise.resolve(promiseData)]);
    processMetricFile.mockReturnValue(deserializedFile);

    fetchMetrics(stateCode, metricType, file, isDemo, (err, result) => {
      expect(err).toBeNull();
      expect(result).toStrictEqual({
        [fileKey]: deserializedFile,
      });
      expect(fetchMetricsFromLocal).toHaveBeenCalledTimes(1);
      expect(fetchMetricsFromLocal).toHaveBeenCalledWith(
        upperCasedStateCode,
        metricType,
        file
      );
      expect(processMetricFile).toHaveBeenCalledTimes(1);
      expect(processMetricFile).toHaveBeenCalledWith(
        contents,
        metadata,
        extension
      );
      done();
    });
  });

  it("should successfully process response with GCS data", (done) => {
    const metricType = "metric_type_2";
    const isDemo = false;
    fetchMetricsFromGCS.mockReturnValue([Promise.resolve(promiseData)]);
    processMetricFile.mockReturnValue(deserializedFile);

    fetchMetrics(stateCode, metricType, file, isDemo, (err, result) => {
      expect(err).toBeNull();
      expect(result).toStrictEqual({
        [fileKey]: deserializedFile,
      });
      expect(fetchMetricsFromGCS).toHaveBeenCalledTimes(1);
      expect(fetchMetricsFromGCS).toHaveBeenCalledWith(
        upperCasedStateCode,
        metricType,
        file
      );
      expect(processMetricFile).toHaveBeenCalledTimes(1);
      expect(processMetricFile).toHaveBeenCalledWith(
        contents,
        metadata,
        extension
      );
      done();
    });
  });

  it("should process response with error", (done) => {
    const metricType = "metric_type_3";
    const isDemo = true;
    fetchMetricsFromLocal.mockReturnValue([Promise.reject(error)]);
    fetchMetrics(stateCode, metricType, file, isDemo, (err, result) => {
      expect(err).toStrictEqual(error);
      expect(result).toBeFalsy();
      done();
    });
  });
});
