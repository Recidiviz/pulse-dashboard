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

const mockCache = {
  set: jest.fn(() => Promise.resolve(true)),
};

jest.mock("../cacheManager", () => {
  return {
    getCache: () => mockCache,
  };
});

describe("refreshRedisCache", () => {
  let mockFetchValue;
  const stateCode = "US_DEMO";
  const metricType = "metric_type";
  const fileName = "lots_of_numbers";
  const fileContents = "a bunch of numbers";

  beforeEach(() => {
    // do not log the expected error - keep tests less verbose
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    mockFetchValue = jest.fn(() =>
      Promise.resolve({ [fileName]: fileContents })
    );
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("calls the cache with the correct key and value", (done) => {
    const cachekey = `${stateCode}-${metricType}-${fileName}`;

    refreshRedisCache(mockFetchValue, stateCode, metricType, (err, result) => {
      expect(err).toBeNull();
      expect(result).toEqual("OK");

      expect(mockFetchValue).toHaveBeenCalledTimes(1);
      expect(mockCache.set).toHaveBeenCalledTimes(1);
      expect(mockCache.set).toHaveBeenCalledWith(cachekey, {
        [fileName]: fileContents,
      });
      done();
    });
  });

  it("returns a responds with an error when caching fails", (done) => {
    const error = new Error("Error setting cache value");
    mockCache.set.mockImplementation(() => {
      throw error;
    });

    refreshRedisCache(mockFetchValue, stateCode, metricType, (err) => {
      expect(mockCache.set).toHaveBeenCalledTimes(1);
      expect(err).toEqual(error);
      done();
    });
  });
});
