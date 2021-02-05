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
const { createSubset, createSubsetFilters } = require("../../filters");

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
    getSubsetManifest: jest.fn().mockImplementation(() => {
      return [
        ["violation_type", [["all"], ["felony"]]],
        ["charge_category", [["all"], ["domestic_violence"], ["sex_offense"]]],
      ];
    }),
    FILES_WITH_SUBSETS: ["revocations_matrix_distribution_by_district"],
  };
});

jest.mock("../../filters/createSubset");

describe("refreshRedisCache", () => {
  let fileName;
  let metricFile;
  let mockFetchValue;
  const stateCode = "US_DEMO";
  const metricType = "metric_type";
  const fileContents = {
    flattenedValueMatrix: "a bunch of numbers",
    metadata: {
      total_data_points: 1,
      dimension_manifest: [],
    },
  };

  beforeEach(() => {
    // do not log the expected error - keep tests less verbose
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    mockFetchValue = jest.fn(() => Promise.resolve(metricFile));
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  describe("refreshing the cache for files without subsets", () => {
    beforeEach(() => {
      fileName = "random_file_name";
      metricFile = { [fileName]: fileContents };
    });

    it("calls the cache with the correct key and value", (done) => {
      const cacheKey = `${stateCode}-${metricType}-${fileName}`;
      refreshRedisCache(
        mockFetchValue,
        stateCode,
        metricType,
        (err, result) => {
          expect(err).toBeNull();
          expect(result).toEqual("OK");

          expect(mockFetchValue).toHaveBeenCalledTimes(1);
          expect(mockCache.set).toHaveBeenCalledTimes(1);
          expect(mockCache.set).toHaveBeenCalledWith(cacheKey, metricFile);
          done();
        }
      );
    });

    it("returns an error response when caching fails", (done) => {
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

  describe("refreshing the cache for files that have subsets", () => {
    beforeEach(() => {
      fileName = "revocations_matrix_distribution_by_district";
      metricFile = { [fileName]: fileContents };
      createSubset.mockImplementation(() => metricFile);
    });

    it("caches a subset file for each subset combination", (done) => {
      refreshRedisCache(
        mockFetchValue,
        stateCode,
        metricType,
        (err, result) => {
          expect(err).toEqual(null);
          expect(result).toEqual("OK");
          expect(createSubset).toHaveBeenCalledTimes(6);
          [
            { violation_type: 0, charge_category: 0 },
            { violation_type: 0, charge_category: 1 },
            { violation_type: 0, charge_category: 2 },
            { violation_type: 1, charge_category: 0 },
            { violation_type: 1, charge_category: 1 },
            { violation_type: 1, charge_category: 2 },
          ].forEach((subsetCombination, index) => {
            const transformedFilters = createSubsetFilters({
              filters: subsetCombination,
            });
            expect(createSubset).toHaveBeenNthCalledWith(
              index + 1,
              fileName,
              transformedFilters,
              metricFile
            );
          });
          done();
        }
      );
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
            "-charge_category=0-violation_type=0",
            "-charge_category=1-violation_type=0",
            "-charge_category=2-violation_type=0",
            "-charge_category=0-violation_type=1",
            "-charge_category=1-violation_type=1",
            "-charge_category=2-violation_type=1",
          ].forEach((subsetKey, index) => {
            expect(mockCache.set).toHaveBeenNthCalledWith(
              index + 1,
              `${cacheKeyPrefix}${subsetKey}`,
              metricFile
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

    it("returns an error when filtering fails", (done) => {
      const error = new Error("Error setting cache value");
      createSubset.mockReset();
      createSubset.mockImplementationOnce(() => {
        throw error;
      });

      refreshRedisCache(mockFetchValue, stateCode, metricType, (err) => {
        expect(mockCache.set).toHaveBeenCalledTimes(0);
        expect(err).toEqual(error);
        done();
      });
    });
  });
});
