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
  newRevocations,
  newRevocationFile,
  communityGoals,
  communityExplore,
  facilitiesGoals,
  facilitiesExplore,
  programmingExplore,
  responder,
} = require("../api");
const { default: fetchMetrics } = require("../../core/fetchMetrics");

jest.mock("../../core/fetchMetrics");

describe("api tests", () => {
  const stateCode = "some code";
  const send = jest.fn();
  const status = jest.fn().mockImplementation(() => {
    return { send };
  });
  const req = { params: { stateCode } };
  const res = { send, status };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call fetchMetrics for newRevocation ", () => {
    newRevocations(req, res);

    expect(fetchMetrics).toHaveBeenCalledWith(
      stateCode,
      "newRevocation",
      null,
      false,
      expect.any(Function)
    );
  });

  it("should call fetchMetrics for newRevocation with file ", () => {
    const file = "some file";
    const reqWithFile = { params: { stateCode, file } };
    newRevocationFile(reqWithFile, res);

    expect(fetchMetrics).toHaveBeenCalledWith(
      stateCode,
      "newRevocation",
      file,
      false,
      expect.any(Function)
    );
  });

  it("should call fetchMetrics for communityGoals ", () => {
    communityGoals(req, res);

    expect(fetchMetrics).toHaveBeenCalledWith(
      stateCode,
      "communityGoals",
      null,
      false,
      expect.any(Function)
    );
  });

  it("should call fetchMetrics for communityExplore ", () => {
    communityExplore(req, res);

    expect(fetchMetrics).toHaveBeenCalledWith(
      stateCode,
      "communityExplore",
      null,
      false,
      expect.any(Function)
    );
  });

  it("should call fetchMetrics for facilitiesGoals ", () => {
    facilitiesGoals(req, res);

    expect(fetchMetrics).toHaveBeenCalledWith(
      stateCode,
      "facilitiesGoals",
      null,
      false,
      expect.any(Function)
    );
  });

  it("should call fetchMetrics for facilitiesExplore ", () => {
    facilitiesExplore(req, res);

    expect(fetchMetrics).toHaveBeenCalledWith(
      stateCode,
      "facilitiesExplore",
      null,
      false,
      expect.any(Function)
    );
  });

  it("should call fetchMetrics for programmingExplore ", () => {
    programmingExplore(req, res);

    expect(fetchMetrics).toHaveBeenCalledWith(
      stateCode,
      "programmingExplore",
      null,
      false,
      expect.any(Function)
    );
  });

  it("should send error", () => {
    const error = "some error";
    const callback = responder(res);
    callback(error, null);

    expect(send).toHaveBeenCalledWith(error);
  });

  it("should send error status code 500 when no status is on error", () => {
    const error = "some error";
    const callback = responder(res);
    callback(error, null);

    expect(status).toHaveBeenCalledWith(500);
  });

  it("should send the error's status code when the status is on the error", () => {
    const error = { status: 400, errors: ["some error"] };
    const callback = responder(res);
    callback(error, null);

    expect(status).toHaveBeenCalledWith(400);
  });

  it("should send data", () => {
    const data = "some data";
    const callback = responder(res);
    callback(null, data);

    expect(send).toHaveBeenCalledWith(data);
  });
});
