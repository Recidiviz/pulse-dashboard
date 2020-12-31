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
const { server } = require("../../../server");

const OLD_ENV = process.env;

jest.mock("../../core/redisCache", () => {
  return {
    redisCache: { set: jest.fn() },
    cacheInRedis: jest
      .fn()
      .mockImplementation((cacheKey, fetcher, callback) => {
        callback(null, { revocations_matrix_by_month: "data" });
      }),
  };
});

jest.mock("../../core/fetchMetrics", () => {
  return {
    default: jest.fn(() => Promise.resolve("data")),
  };
});

describe("Server tests", () => {
  let app;

  beforeAll(() => {
    // Reduce noise in the test
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.resetModules();
    jest.restoreAllMocks();
    server.close();
    process.env = OLD_ENV;
  });

  describe("GET api/:stateCode/newRevocations/:file", () => {
    beforeEach(() => {
      process.env = Object.assign(process.env, {
        IS_DEMO: "true",
        AUTH_ENV: "test",
      });
      jest.resetModules();
      app = require("../../app").app;
    });

    it("should respond with a 200 for a valid stateCode", function () {
      return request(app)
        .get("/api/US_DEMO/newRevocations/revocations_matrix_by_month")
        .then((response) => {
          expect(response.statusCode).toEqual(200);
          expect(response.body).toHaveProperty("revocations_matrix_by_month");
        });
    });

    it("should respond with a 400 for an invalid stateCode", function () {
      const expectedErrors = {
        errors: [
          {
            location: "params",
            msg: "Invalid value",
            param: "stateCode",
            value: "HI",
          },
        ],
        status: 400,
      };
      return request(app)
        .get("/api/HI/newRevocations/revocations_matrix_by_month")
        .then((response) => {
          expect(response.statusCode).toEqual(400);
          expect(response.body).toEqual(expectedErrors);
        });
    });

    it("should respond with a 400 for an invalid query param", function () {
      const expectedErrors = {
        errors: [
          {
            location: "query",
            msg: "Invalid value",
            param: "metricPeriodMonths",
            value: "1",
          },
        ],
        status: 400,
      };
      return request(app)
        .get(
          "/api/US_DEMO/newRevocations/revocations_matrix_by_month?metricPeriodMonths=1"
        )
        .then((response) => {
          expect(response.statusCode).toEqual(400);
          expect(response.body).toEqual(expectedErrors);
        });
    });
  });

  describe("GET /api/:stateCode/refreshCache", () => {
    beforeEach(() => {
      process.env = Object.assign(process.env, {
        IS_DEMO: "false",
        AUTH_ENV: "test",
      });
      jest.resetModules();
      app = require("../../app").app;
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
});
