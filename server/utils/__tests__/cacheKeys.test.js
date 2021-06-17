// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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
import {
  getCacheKey,
  getCacheKeyForSubsetCombination,
  getUserRestrictionCacheKeyValues,
  getSubsetCombinations,
} from "../cacheKeys";

describe("cacheKeys utils", () => {
  const subsetManifest = [
    ["violation_type", [["1"], ["2"]]],
    ["charge_category", [["1"], ["2"]]],
  ];

  const allSubsetCombinations = [
    { violation_type: 0, charge_category: 0 },
    { violation_type: 0, charge_category: 1 },
    { violation_type: 1, charge_category: 0 },
    { violation_type: 1, charge_category: 1 },
  ];

  describe("getCacheKeyForSubsetCombination", () => {
    it("returns a cache key for the subset combination", () => {
      expect(
        getCacheKeyForSubsetCombination({
          violation_type: 0,
          charge_category: 1,
        })
      ).toEqual("violation_type=0-charge_category=1");
    });
  });

  describe("getSubsetCombinations", () => {
    it("returns an array of all possible subset filters", () => {
      expect(getSubsetCombinations(subsetManifest)).toEqual(
        allSubsetCombinations
      );
    });
  });

  describe("getUserRestrictionCacheKeyValues", () => {
    it("returns a key with the values for an array", () => {
      const cacheKeySubset = {
        level_1_supervision_location: ["24", "04n"],
      };
      expect(getUserRestrictionCacheKeyValues({ cacheKeySubset })).toEqual(
        "-level_1_supervision_location=04n,24"
      );
    });

    it("returns an empty string when there are no user restrictions", () => {
      const cacheKeySubset = {
        charge_category: "general",
      };
      expect(getUserRestrictionCacheKeyValues({ cacheKeySubset })).toEqual("");
    });
  });

  describe("getCacheKey", () => {
    describe("given no metricName", () => {
      it("returns the cacheKey without the metricName or subset keys", () => {
        expect(
          getCacheKey({
            stateCode: "US_MO",
            metricType: "goals",
            metricName: null,
            cacheKeySubset: {},
          })
        ).toEqual("US_MO-goals");
      });
    });

    describe("given a metricName without a subset manifest", () => {
      it("returns the cacheKey with the metricName", () => {
        expect(
          getCacheKey({
            stateCode: "US_MO",
            metricType: "newRevocations",
            metricName: "random_file_name",
            cacheKeySubset: {},
          })
        ).toEqual("US_MO-newRevocations-random_file_name");
      });
    });

    describe("given a metricName with a subset manifest", () => {
      it("returns a cacheKey with the metricName and subset keys", () => {
        expect(
          getCacheKey({
            stateCode: "US_MO",
            metricType: "newRevocations",
            metricName: "revocations_matrix_distribution_by_district",
            cacheKeySubset: {
              violation_type: "felony",
            },
          })
        ).toEqual(
          "US_MO-newRevocations-revocations_matrix_distribution_by_district-violation_type=4"
        );

        expect(
          getCacheKey({
            stateCode: "US_MO",
            metricType: "newRevocations",
            metricName: "revocations_matrix_distribution_by_district",
            cacheKeySubset: {
              violation_type: "all",
            },
          })
        ).toEqual(
          "US_MO-newRevocations-revocations_matrix_distribution_by_district-violation_type=0"
        );
      });
    });

    describe("when there are user restrictions", () => {
      describe("given a metricName without a subsets", () => {
        it("returns the cacheKey with the metricName and the user restriction", () => {
          expect(
            getCacheKey({
              stateCode: "US_MO",
              metricType: "newRevocations",
              metricName: "random_file_name",
              cacheKeySubset: { level_1_supervision_location: ["03"] },
            })
          ).toEqual(
            "US_MO-newRevocations-random_file_name-level_1_supervision_location=03"
          );
        });
      });

      describe("given a metricName with a subset manifest", () => {
        it("returns a cacheKey with subset and user restriction keys", () => {
          expect(
            getCacheKey({
              stateCode: "US_MO",
              metricType: "newRevocations",
              metricName: "revocations_matrix_distribution_by_gender",
              cacheKeySubset: {
                violation_type: "felony",
                level_1_supervision_location: ["03"],
              },
            })
          ).toEqual(
            "US_MO-newRevocations-revocations_matrix_distribution_by_gender-violation_type=4-level_1_supervision_location=03"
          );
        });
      });

      describe("given a metricName with a subset manifest that is not filtered by user restrictions", () => {
        it("returns a cacheKey with subset and no user restriction keys", () => {
          expect(
            getCacheKey({
              stateCode: "US_MO",
              metricType: "newRevocations",
              metricName: "revocations_matrix_distribution_by_district",
              cacheKeySubset: {
                violation_type: "felony",
                level_1_supervision_location: ["03"],
              },
            })
          ).toEqual(
            "US_MO-newRevocations-revocations_matrix_distribution_by_district-violation_type=4"
          );
        });
      });
    });
  });
});
