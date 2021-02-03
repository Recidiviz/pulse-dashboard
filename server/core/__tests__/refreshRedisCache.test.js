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
  let fileKey;
  let metricFile;
  let mockFetchValue;
  let responseErrors = null;
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
      fileKey = "random_file_name";
      metricFile = { [fileKey]: fileContents };
    });

    it("calls the cache with the correct key and value", async () => {
      const cacheKey = `${stateCode}-${metricType}-${fileKey}`;

      await refreshRedisCache(
        mockFetchValue,
        stateCode,
        metricType,
        `${fileKey}.txt`
      ).then(() => {
        expect(responseErrors).toBeNull();
        expect(mockFetchValue).toHaveBeenCalledTimes(1);
        expect(mockCache.set).toHaveBeenCalledTimes(1);
        expect(mockCache.set).toHaveBeenCalledWith(cacheKey, metricFile);
      });
      expect.hasAssertions();
    });

    it("returns an array of errors when caching fails", async () => {
      const error = new Error("Error setting cache value");
      responseErrors = [];
      mockCache.set.mockRejectedValueOnce(error);

      await refreshRedisCache(
        mockFetchValue,
        stateCode,
        metricType,
        `${fileKey}.txt`,
        responseErrors
      ).then((errors) => {
        expect(mockCache.set).toHaveBeenCalledTimes(1);
        expect(errors).toEqual([error.message]);
      });

      expect.hasAssertions();
    });
  });

  describe("refreshing the cache for files that have subsets", () => {
    beforeEach(() => {
      fileKey = "revocations_matrix_distribution_by_district";
      metricFile = { [fileKey]: fileContents };
      responseErrors = [];
      createSubset.mockImplementation(() => metricFile);
    });

    it("calls createSubset for each subset combination", async () => {
      await refreshRedisCache(
        mockFetchValue,
        stateCode,
        metricType,
        `${fileKey}.txt`,
        responseErrors
      ).then(() => {
        expect(responseErrors).toEqual([]);
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
            fileKey,
            transformedFilters,
            metricFile
          );
        });
      });
    });

    it("sets the cache key for each possible subset", async () => {
      const cacheKeyPrefix = `${stateCode}-${metricType}-${fileKey}`;

      await refreshRedisCache(
        mockFetchValue,
        stateCode,
        metricType,
        `${fileKey}.txt`,
        responseErrors
      ).then(() => {
        expect(responseErrors).toEqual([]);
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
      });
    });

    it("returns an array of error messages when caching fails", async () => {
      const error = new Error("Error setting cache value");
      mockCache.set.mockRejectedValueOnce(error);

      await refreshRedisCache(
        mockFetchValue,
        stateCode,
        metricType,
        `${fileKey}.txt`,
        responseErrors
      ).then(() => {
        expect(responseErrors).toEqual([error.message]);
      });
    });

    it("continues to set the other cache keys when one cachekey causes an error", async () => {
      const error = new Error("Error setting cache value");
      mockCache.set.mockRejectedValueOnce(error);

      await refreshRedisCache(
        mockFetchValue,
        stateCode,
        metricType,
        `${fileKey}.txt`,
        responseErrors
      ).then(() => {
        expect(mockCache.set).toHaveBeenCalledTimes(6);
      });
    });

    it("does not call set cache if filtering fails", async () => {
      const error = new Error("Error setting cache value");
      createSubset.mockReset();
      createSubset.mockImplementationOnce(() => {
        throw error;
      });

      await refreshRedisCache(
        mockFetchValue,
        stateCode,
        metricType,
        `${fileKey}.txt`,
        responseErrors
      ).then(() => {
        expect(mockCache.set).toHaveBeenCalledTimes(0);
        expect(responseErrors).toEqual([error.message]);
      });
    });
  });
});
