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

const { default: getCollections } = require("../resources/getCollections");
const { COLLECTIONS } = require("../../constants/collections");
const dimensionsByStateCode = require("../resources/dimensionValues");

describe("getCollections", () => {
  describe("when a stateCode does not have a collection with dimensions requiring validation", () => {
    it("does not include newRevocations collection", () => {
      const collections = getCollections("US_ND");
      expect(collections).not.toHaveProperty(COLLECTIONS.NEW_REVOCATION);
    });

    it("has the collections without dimensions", () => {
      const collections = getCollections("US_ND");
      expect(collections).toHaveProperty(COLLECTIONS.GOALS);
      expect(collections).toHaveProperty(COLLECTIONS.COMMUNITY_EXPLORE);
      expect(collections).toHaveProperty(COLLECTIONS.FACILITIES_EXPLORE);
    });
  });

  describe("when a stateCode has a collection with dimensions requiring validation", () => {
    it("returns the collection with the correct dimension keys", () => {
      ["US_PA", "US_MO"].forEach((stateCode) => {
        const collections = getCollections(stateCode);
        const expectedDimensions = Object.keys(
          dimensionsByStateCode[stateCode]
        );
        expect(collections).toHaveProperty(COLLECTIONS.NEW_REVOCATION);
        Object.keys(collections[COLLECTIONS.NEW_REVOCATION]).forEach(
          (metricName) => {
            const { dimensions } = collections[COLLECTIONS.NEW_REVOCATION][
              metricName
            ];
            if (dimensions) {
              expect(expectedDimensions).toEqual(
                expect.arrayContaining(Object.keys(dimensions))
              );
            }
          }
        );
      });
      // There are 9 metrics in newRevocations that have dimensions
      expect.assertions(20);
    });

    it("returns the correct dimensions for the stateCode", () => {
      ["US_PA", "US_MO"].forEach((stateCode) => {
        const collections = getCollections(stateCode);
        expect(collections).toHaveProperty(COLLECTIONS.NEW_REVOCATION);
        expect(collections[COLLECTIONS.NEW_REVOCATION]).toHaveProperty(
          "revocations_matrix_by_month"
        );
        expect(
          collections[COLLECTIONS.NEW_REVOCATION].revocations_matrix_by_month
            .dimensions.charge_category
        ).toEqual(dimensionsByStateCode[stateCode].charge_category);
      });
    });
  });
});
