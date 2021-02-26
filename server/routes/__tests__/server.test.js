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
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================

const Sentry = require("@sentry/node");
const request = require("supertest");
const { server } = require("../../../server");
const { clearMemoryCache } = require("../../core/cacheManager");

const OLD_ENV = process.env;

jest.mock("@sentry/node", () => ({
  Handlers: {
    errorHandler: jest.fn(() => {
      return (error, _req, _res, next) => {
        next(error);
      };
    }),
    requestHandler: jest.fn(() => {
      return (error, _req, _res, next) => {
        next(error);
      };
    }),
  },
  init: () => {},
}));

describe("Server tests", () => {
  let app;

  beforeAll(() => {
    // Reduce noise in the test
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(async () => {
    await clearMemoryCache();
    jest.resetModules();
    jest.restoreAllMocks();
    server.close();
    process.env = OLD_ENV;
  });

  describe("GET api/:stateCode/facilities/goals", () => {
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
        .get("/api/US_DEMO/facilities/goals")
        .then((response) => {
          expect(response.statusCode).toEqual(200);
        });
    });
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
          expect(response.body.revocations_matrix_by_month).toHaveProperty(
            "flattenedValueMatrix"
          );
          expect(response.body.revocations_matrix_by_month).toHaveProperty(
            "metadata"
          );
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
            value: "42",
          },
        ],
        status: 400,
      };
      return request(app)
        .get(
          "/api/US_DEMO/newRevocations/revocations_matrix_by_month?metricPeriodMonths=42"
        )
        .then((response) => {
          expect(response.statusCode).toEqual(400);
          expect(response.body).toEqual(expectedErrors);
        });
    });
  });

  describe("GET api/:stateCode/restrictedAccess/", () => {
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
        .post("/api/US_DEMO/restrictedAccess/")
        .send({
          userEmail: "thirteen@state.gov",
        })
        .then((response) => {
          expect(response.statusCode).toEqual(200);
          expect(response.body).toEqual({});
        });
    });

    it("should respond with a 400 if the request body is missing userEmail", function () {
      const expectedErrors = {
        errors: [
          {
            location: "body",
            msg: "Request is missing userEmail parameter",
            param: "userEmail",
          },
        ],
        status: 400,
      };
      return request(app)
        .post("/api/US_DEMO/restrictedAccess/")
        .send()
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
      jest.mock("../../core/fetchMetrics", () => {
        return {
          default: jest.fn(() =>
            Promise.resolve({ file_1: "content_1", file_2: "content_2" })
          ),
        };
      });
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

  describe("When a route handler throws an error", () => {
    beforeEach(() => {
      process.env = Object.assign(process.env, {
        IS_DEMO: "false",
        AUTH_ENV: "test",
      });
      jest.resetModules();
      app = require("../../app").app;
    });

    it("responds with a formatted error resposne", () => {
      return request(app)
        .post("/api/US_DEMO/restrictedAccess/")
        .send()
        .then((response) => {
          expect(response.statusCode).toEqual(500);
          expect(response.body.errors).toEqual([
            "No authorization token was found",
          ]);
          expect(response.body.status).toEqual(500);
          expect(Sentry.Handlers.errorHandler).toHaveBeenCalledTimes(1);
        });
    });
  });
});
