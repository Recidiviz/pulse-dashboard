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
          "US_MO-newRevocations-revocations_matrix_distribution_by_district-violation_type=1"
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
          "US_MO-newRevocations-revocations_matrix_distribution_by_district-violation_type=0"
        );
      });
    });
  });
});
