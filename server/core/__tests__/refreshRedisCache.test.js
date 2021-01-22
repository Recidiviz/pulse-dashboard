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

jest.mock("../../constants/subsetManifest", () => {
  return {
    SUBSET_MANIFEST: [
      ["violationType", [["all"], ["felony"]]],
      ["chargeCategory", [["all"], ["domestic_violence"], ["sex_offense"]]],
    ],
    FILES_WITH_SUBSETS: ["revocations_matrix_distribution_by_district"],
  };
});

describe("refreshRedisCache", () => {
  let fileName;
  let mockFetchValue;
  let cacheKey;
  const stateCode = "US_DEMO";
  const metricType = "metric_type";
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

  describe("refreshing the cache without subset files", () => {
    beforeEach(() => {
      fileName = "random_file_name";
      cacheKey = `${stateCode}-${metricType}-${fileName}`;
    });

    it("calls the cache with the correct key and value", (done) => {
      refreshRedisCache(
        mockFetchValue,
        stateCode,
        metricType,
        (err, result) => {
          expect(err).toBeNull();
          expect(result).toEqual("OK");

          expect(mockFetchValue).toHaveBeenCalledTimes(1);
          expect(mockCache.set).toHaveBeenCalledTimes(1);
          expect(mockCache.set).toHaveBeenCalledWith(cacheKey, {
            [fileName]: fileContents,
          });
          done();
        }
      );
    });

    it("returns a responds with an error when caching fails", (done) => {
      const error = new Error("Error setting cache value");
      mockCache.set.mockImplementationOnce(() => {
        throw error;
      });

      refreshRedisCache(mockFetchValue, stateCode, metricType, (err) => {
        expect(mockCache.set).toHaveBeenCalledTimes(1);
        expect(err).toEqual(error);
        done();
      });
    });
  });

  describe("refreshing the cache with subset files", () => {
    beforeEach(() => {
      fileName = "revocations_matrix_distribution_by_district";
      cacheKey = `${stateCode}-${metricType}-${fileName}`;
    });

    it("sets the cache key for each possible subset", (done) => {
      const cacheKeyPrefix = `${stateCode}-${metricType}-${fileName}`;

      refreshRedisCache(
        mockFetchValue,
        stateCode,
        metricType,
        (err, result) => {
          expect(err).toEqual(null);
          expect(result).toEqual("OK");
          expect(mockCache.set).toHaveBeenCalledTimes(6);
          [
            "violationType=0-chargeCategory=0",
            "violationType=0-chargeCategory=1",
            "violationType=0-chargeCategory=2",
            "violationType=1-chargeCategory=0",
            "violationType=1-chargeCategory=1",
            "violationType=1-chargeCategory=2",
          ].forEach((subsetKey, index) => {
            expect(mockCache.set).toHaveBeenNthCalledWith(
              index + 1,
              `${cacheKeyPrefix}-${subsetKey}`,
              {
                [fileName]: fileContents,
              }
            );
          });
          done();
        }
      );
    });

    it("returns an error when caching fails", (done) => {
      const error = new Error("Error setting cache value");
      mockCache.set.mockImplementationOnce(() => {
        throw error;
      });

      refreshRedisCache(mockFetchValue, stateCode, metricType, (err) => {
        expect(mockCache.set).toHaveBeenCalledTimes(1);
        expect(err).toEqual(error);
        done();
      });
    });
  });
});
