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

const request = require("supertest");
const { app, server } = require("../../../server");

jest.mock("../../core/redisCache", () => {
  return {
    redisCache: { set: jest.fn() },
  };
});

jest.mock("../../core/fetchMetrics", () => {
  return {
    default: jest.fn(() => Promise.resolve("data")),
  };
});

describe("GET /api/:stateCode/refreshCache", () => {
  beforeAll(() => {
    // Reduce noise in the test
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.resetModules();
    jest.restoreAllMocks();
    server.close();
  });

  it("should respond with a 403 when cron job header is invalid", () => {
    return request(app)
      .get("/api/US_PA/refreshCache")
      .then((response) => {
        expect(response.statusCode).toEqual(403);
      });
  });

  it("should respond successfully when cron job header is valid", () => {
    return request(app)
      .get("/api/US_PA/refreshCache")
      .set("X-Appengine-Cron", "true")
      .then((response) => {
        expect(response.statusCode).toEqual(200);
      });
  });
});
