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

jest.mock("../../core/fetchMetrics", () => {
  return {
    default: jest.fn(() =>
      Promise.resolve({ file_1: "content_1", file_2: "content_2" })
    ),
  };
});
const { default: fetchMetrics } = require("../../core/fetchMetrics");
const {
  newRevocations,
  newRevocationFile,
  communityGoals,
  communityExplore,
  facilitiesGoals,
  facilitiesExplore,
  programmingExplore,
  refreshCache,
  responder,
} = require("../api");

const { redisCache, clearRedisCache } = require("../../core/redisCache");
const { clearMemoryCache } = require("../../core/memoryCache");

describe("API tests", () => {
  const stateCode = "test_id";

  beforeAll(() => {
    // Reduce noise in the test
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  describe("API fetching and caching", () => {
    const metricControllers = [
      [newRevocations, "redis", clearRedisCache],
      [newRevocationFile, "redis", clearRedisCache],
      [communityGoals, "memory", clearMemoryCache],
      [communityExplore, "memory", clearMemoryCache],
      [facilitiesGoals, "memory", clearMemoryCache],
      [facilitiesExplore, "memory", clearMemoryCache],
      [programmingExplore, "memory", clearMemoryCache],
    ];

    afterEach(async () => {
      await clearMemoryCache();
      await clearRedisCache();
      fetchMetrics.mockClear();
    });

    function fakeRequest(routeHandler, req = { params: { stateCode } }) {
      return new Promise((resolve) => {
        const send = resolve;
        const status = jest.fn().mockImplementation(() => {
          return { send };
        });
        const res = { send, status };
        routeHandler(req, res);
      });
    }

    async function requestAndExpectFetchMetricsCalled(controllerFn, numCalls) {
      await fakeRequest(controllerFn);
      expect(fetchMetrics.mock.calls.length).toBe(numCalls);
      fetchMetrics.mockClear();
    }

    test.each(metricControllers)(
      "%p fetches metrics only if data is not cached in %s store",
      async (controllerFn, _source, clearCache, done) => {
        await requestAndExpectFetchMetricsCalled(controllerFn, 1);

        await requestAndExpectFetchMetricsCalled(controllerFn, 0);

        await clearCache();

        await requestAndExpectFetchMetricsCalled(controllerFn, 1);
        await requestAndExpectFetchMetricsCalled(controllerFn, 0);

        done();
      }
    );

    it("newRevocations - calls fetchMetrics with the correct args", async () => {
      await fakeRequest(newRevocations);

      expect(fetchMetrics).toHaveBeenCalledWith(
        stateCode,
        "newRevocation",
        null,
        false
      );

      await clearRedisCache();
    });

    it("newRevocationFile - calls fetchMetrics with the correct args", async () => {
      const file = "test_file";
      await fakeRequest(newRevocationFile, { params: { stateCode, file } });

      expect(fetchMetrics).toHaveBeenCalledWith(
        stateCode,
        "newRevocation",
        file,
        false
      );

      await clearRedisCache();
    });

    it("refreshCache - calls fetchMetrics with the correct args", async () => {
      const redisCacheSpy = jest.spyOn(redisCache, "set");
      await fakeRequest(refreshCache);

      expect(fetchMetrics).toHaveBeenCalledWith(
        stateCode,
        "newRevocation",
        null,
        false
      );

      expect(redisCacheSpy).nthCalledWith(
        1,
        `${stateCode.toUpperCase()}-newRevocation-file_1`,
        { file_1: "content_1" }
      );

      expect(redisCacheSpy).nthCalledWith(
        2,
        `${stateCode.toUpperCase()}-newRevocation-file_2`,
        { file_2: "content_2" }
      );

      await clearRedisCache();
    });
  });

  describe("responder test", () => {
    const send = jest.fn();
    const status = jest.fn().mockImplementation(() => {
      return { send };
    });
    const res = { send, status };

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

      expect(status).toHaveBeenCalledWith(error.status);
    });

    it("should send the error's status code when the error has a code property", () => {
      const error = { code: 404, error: "File not found" };
      const callback = responder(res);
      callback(error, null);

      expect(status).toHaveBeenCalledWith(error.code);
    });

    it("should send data", () => {
      const data = "some data";
      const callback = responder(res);
      callback(null, data);

      expect(send).toHaveBeenCalledWith(data);
    });
  });
});
