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

const mockMetricType = "someMetricType";
const mockFileName = "someFileName";
const mockSecondFileName = "someOtherFileName";
const mockTxtFile = `${mockFileName}.txt`;
const mockJsonFile = `${mockSecondFileName}.json`;
const mockMetricTypeFiles = [mockTxtFile, mockJsonFile];
const mockMetricTypes = { [mockMetricType]: mockMetricTypeFiles };

jest.mock("../../constants/filesByMetricType", () => ({
  FILES_BY_METRIC_TYPE: mockMetricTypes,
}));
const { getFilesByMetricType } = require("../getFilesByMetricType");

describe("getFilesByMetricType tests", () => {
  it("should return file names for metricType", () => {
    expect(getFilesByMetricType(mockMetricType)).toStrictEqual(
      mockMetricTypeFiles
    );
  });

  it("should throw error if there is no corresponding metricType", () => {
    const metricType = "random metric type that is not real case";
    expect(() => getFilesByMetricType(metricType)).toThrow(Error);
  });

  it("should return txt if for given file name both txt and json files exist", () => {
    const mockTxtFile = `${mockFileName}.txt`;
    const mockJsonFile = `${mockFileName}.json`;
    jest.mock("../../constants/filesByMetricType", () => ({
      FILES_BY_METRIC_TYPE: {
        [mockMetricType]: [mockJsonFile, mockTxtFile],
      },
    }));
    const { getFilesByMetricType } = require("../getFilesByMetricType");

    expect(getFilesByMetricType(mockMetricType, mockFileName)).toEqual([
      mockTxtFile,
    ]);
  });

  it("should return json if for given file name txt does not exist", () => {
    expect(getFilesByMetricType(mockMetricType, mockSecondFileName)).toEqual([
      mockJsonFile,
    ]);
  });

  it("should throw error if there is no corresponding file", () => {
    const fileName = "random file name that is not real case";
    expect(() => getFilesByMetricType(mockMetricType, fileName)).toThrow(Error);
  });
});
