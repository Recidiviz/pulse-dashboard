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

const { downloadFile } = require("../objectStorage");
const { Storage } = require("@google-cloud/storage");

jest.mock("@google-cloud/storage", () => ({
  Storage: jest.fn(),
}));

describe("objectStorage tests", () => {
  const bucketName = "some name";
  const stateCode = "some code";
  const fileName = "some file name";
  const returnValue = "some value, no matter if Promise or no";

  it("should call chain of methods to download file", () => {
    const download = jest.fn().mockReturnValue(returnValue);
    const file = jest.fn().mockImplementation(() => ({ download }));
    const bucket = jest.fn().mockImplementation(() => ({ file }));
    Storage.mockImplementation(() => ({ bucket: bucket }));

    expect(downloadFile(bucketName, stateCode, fileName)).toEqual(returnValue);
    expect(Storage).toHaveBeenCalledTimes(1);
    expect(bucket).toHaveBeenCalledWith(bucketName);
    expect(file).toHaveBeenCalledWith(`${stateCode}/${fileName}`);
    expect(download).toHaveBeenCalledTimes(1);
  });
});
