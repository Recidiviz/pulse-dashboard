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

const { default: processMetricFile } = require("../processMetricFile");

const {
  default: processJsonLinesMetricFile,
} = require("../processJsonLinesMetricFile");

jest.mock("../processJsonLinesMetricFile");

describe("processMetricFile tests", () => {
  const mockStringContents = "some string content";
  const mockContents = Buffer.from(mockStringContents);
  const mockMetadata = "some metadata";
  const mockExtension = ".json";

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return null if file is empty", () => {
    const mockContents = Buffer.from("");

    expect(
      processMetricFile(mockContents, mockMetadata, mockExtension)
    ).toStrictEqual(null);
  });

  it("should parse result with processJsonLinesMetricFile func", () => {
    const mockJson = "some json result";
    processJsonLinesMetricFile.mockReturnValue(mockJson);

    expect(
      processMetricFile(mockContents, mockMetadata, mockExtension)
    ).toStrictEqual(mockJson);
    expect(processJsonLinesMetricFile).toHaveBeenCalledWith(mockStringContents);
  });

  it("should return the string contents of the results", () => {
    const mockExtension = ".txt";

    expect(
      processMetricFile(mockContents, mockMetadata, mockExtension)
    ).toStrictEqual({
      flattenedValueMatrix: mockStringContents,
      metadata: mockMetadata,
    });
  });

  it("should return empty object if extensions do not match", () => {
    const mockExtension = ".someExtension";
    expect(
      processMetricFile(mockContents, mockMetadata, mockExtension)
    ).toStrictEqual({});
  });
});
