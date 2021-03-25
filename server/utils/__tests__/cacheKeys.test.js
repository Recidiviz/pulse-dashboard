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

  describe("getCacheKey", () => {
    describe("given no metricName", () => {
      it("returns the cacheKey without the metricName or subset keys", () => {
        expect(
          getCacheKey({
            stateCode: "US_MO",
            metricType: "communityGoals",
            metricName: null,
            cacheKeySubset: {},
          })
        ).toEqual("US_MO-communityGoals");
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
              violationType: "felony",
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
              violationType: "all",
            },
          })
        ).toEqual(
          "US_MO-newRevocations-revocations_matrix_distribution_by_district-violation_type=0"
        );
      });
    });

    describe("when there is a restricted district", () => {
      describe("given a metricName without a subset manifest", () => {
        it("returns the cacheKey with the metricName with the restricted district key", () => {
          expect(
            getCacheKey({
              stateCode: "US_MO",
              metricType: "newRevocations",
              metricName: "random_file_name",
              cacheKeySubset: { restrictedDistrict: ["03"] },
            })
          ).toEqual(
            "US_MO-newRevocations-random_file_name-restrictedDistrict=03"
          );
        });
      });

      describe("given a metricName with a subset manifest", () => {
        it("returns a cacheKey with the metricName and subset keys and restricted district key", () => {
          expect(
            getCacheKey({
              stateCode: "US_MO",
              metricType: "newRevocations",
              metricName: "revocations_matrix_distribution_by_district",
              cacheKeySubset: {
                violationType: "felony",
                restrictedDistrict: ["03"],
              },
            })
          ).toEqual(
            "US_MO-newRevocations-revocations_matrix_distribution_by_district-violation_type=4-restrictedDistrict=03"
          );

          expect(
            getCacheKey({
              stateCode: "US_MO",
              metricType: "newRevocations",
              metricName: "revocations_matrix_distribution_by_district",
              cacheKeySubset: {
                violationType: "all",
                restrictedDistrict: ["03"],
              },
            })
          ).toEqual(
            "US_MO-newRevocations-revocations_matrix_distribution_by_district-violation_type=0-restrictedDistrict=03"
          );
        });
      });
    });
  });
});
