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

const { unzipSync } = require("zlib");
const {
  default: processOptimizedTxtMetricFile,
} = require("../processOptimizedTxtMetricFile");
jest.mock("zlib");

describe("processOptimizedTxtMetricFile tests", () => {
  const mockStringContents = "some string content";
  const mockDecompressedValue = "some decompressed Value";
  const mockMetadata = "some metadata";

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return decompressed value matrix and metadata", () => {
    unzipSync.mockReturnValue(mockDecompressedValue);

    expect(
      processOptimizedTxtMetricFile(mockStringContents, mockMetadata)
    ).toStrictEqual({
      flattenedValueMatrix: mockDecompressedValue,
      metadata: mockMetadata,
    });
    expect(unzipSync).toHaveBeenCalledWith(mockStringContents);
  });

  it("should return original string and metadata", () => {
    unzipSync.mockImplementation(() => {
      throw new Error();
    });

    expect(
      processOptimizedTxtMetricFile(mockStringContents, mockMetadata)
    ).toStrictEqual({
      flattenedValueMatrix: mockStringContents,
      metadata: mockMetadata,
    });
    expect(unzipSync).toHaveBeenCalledWith(mockStringContents);
  });
});
