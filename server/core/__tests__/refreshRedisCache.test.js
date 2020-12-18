// it("should process response with error", (done) => {
//   const metricType = "metric_type_3";
//   const isDemo = true;
//   fetchMetricsFromLocal.mockReturnValue([Promise.reject(error)]);
//   fetchMetrics(stateCode, metricType, file, isDemo, (err, result) => {
//     expect(err).toStrictEqual(error);
//     expect(result).toBeFalsy();
//     done();
//   });
// });
// const error = new Error("some error");
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
const { default: refreshRedisCache } = require("../refreshRedisCache");
const { redisCache } = require("../redisCache");

jest.mock("../redisCache", () => {
  return {
    redisCache: {
      set: jest.fn(() => Promise.resolve(true)),
    },
  };
});

describe("refreshRedisCache", () => {
  let mockFetchValue;
  const stateCode = "US_DEMO";
  const metricType = "metric_type";
  const fileName = "lots_of_numbers";
  const fileContents = "a bunch of numbers";

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    // do not log the expected error - keep tests less verbose
    jest.spyOn(console, "log").mockImplementation(() => {});

    mockFetchValue = jest.fn(() =>
      Promise.resolve({ [fileName]: fileContents })
    );
  });

  it("calls redisCache with the correct key and value", (done) => {
    const cachekey = `${stateCode}-${metricType}-${fileName}`;

    refreshRedisCache(mockFetchValue, stateCode, metricType, (err, result) => {
      expect(err).toBeNull();
      expect(result).toEqual("OK");

      expect(mockFetchValue).toHaveBeenCalledTimes(1);

      expect(redisCache.set).toHaveBeenCalledTimes(1);
      expect(redisCache.set).toHaveBeenCalledWith(cachekey, fileContents);
      done();
    });
  });

  it("returns a responds with an error when caching fails", (done) => {
    const error = new Error("Error setting cache value");
    redisCache.set.mockImplementation(() => {
      throw error;
    });

    refreshRedisCache(mockFetchValue, stateCode, metricType, (err) => {
      expect(redisCache.set).toHaveBeenCalledTimes(1);
      expect(err).toEqual(error);
      done();
    });
  });
});
