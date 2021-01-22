import { getCacheKey, getSubsetCacheKeyCombinations } from "../cacheKeys";
import { SUBSET_MANIFEST } from "../../constants/subsetManifest";

describe("getSubsetCacheKeyCombinations", () => {
  const subsetManifest = [
    ...SUBSET_MANIFEST,
    [
      "chargeCategory",
      [
        ["all"],
        [
          "domestic_violence",
          "alcohol_drug",
          "general",
          "serious_mental_illness",
        ],
        ["sex_offense"],
      ],
    ],
  ];

  it("returns an array of possible cache keys subsets from the subset manifest", () => {
    expect(getSubsetCacheKeyCombinations(subsetManifest)).toEqual([
      "violationType=0-chargeCategory=0",
      "violationType=0-chargeCategory=1",
      "violationType=0-chargeCategory=2",
      "violationType=1-chargeCategory=0",
      "violationType=1-chargeCategory=1",
      "violationType=1-chargeCategory=2",
    ]);
  });
});

describe("getCacheKey", () => {
  describe("given no filename", () => {
    it("returns the cacheKey without the file or subset keys", () => {
      expect(
        getCacheKey({
          stateCode: "US_MO",
          metricType: "communityGoals",
          file: null,
          cacheKeySubset: null,
        })
      ).toEqual("US_MO-communityGoals");
    });
  });

  describe("given a file without a subset manifest", () => {
    it("returns the cacheKey with the filename", () => {
      expect(
        getCacheKey({
          stateCode: "US_MO",
          metricType: "newRevocations",
          file: "random_file_name",
          cacheKeySubset: null,
        })
      ).toEqual("US_MO-newRevocations-random_file_name");
    });
  });

  describe("given a file with a subset manifest", () => {
    it("returns a cacheKey with the filename and subset keys", () => {
      expect(
        getCacheKey({
          stateCode: "US_MO",
          metricType: "newRevocations",
          file: "revocations_matrix_distribution_by_district",
          cacheKeySubset: {
            violationType: "felony",
          },
        })
      ).toEqual(
        "US_MO-newRevocations-revocations_matrix_distribution_by_district-violationType=1"
      );

      expect(
        getCacheKey({
          stateCode: "US_MO",
          metricType: "newRevocations",
          file: "revocations_matrix_distribution_by_district",
          cacheKeySubset: {
            violationType: "all",
          },
        })
      ).toEqual(
        "US_MO-newRevocations-revocations_matrix_distribution_by_district-violationType=0"
      );
    });
  });
});
