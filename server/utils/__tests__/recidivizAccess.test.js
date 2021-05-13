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
const { restrictAccessForRecidivizUser } = require("../recidivizAccess");

describe("recidivizAccess", () => {
  describe("isDemoMode", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    it("should return true if env is truthy", () => {
      process.env.IS_DEMO = "true";
      const { isDemoMode } = require("../recidivizAccess");

      expect(isDemoMode).toBe(true);
    });

    it("should return false if env is falsy", () => {
      process.env.IS_DEMO = "false";
      const { isDemoMode } = require("../recidivizAccess");

      expect(isDemoMode).toBe(false);
    });
  });

  describe("restrictAccessForRecidivizUser", () => {
    describe("recidiviz user for a stateCode without restrictions", () => {
      it("returns false", () => {
        expect(
          restrictAccessForRecidivizUser({
            requestStateCode: "US_MO",
            userStateCode: "recidiviz",
            userRestrictions: undefined,
          })
        );
      });
    });

    describe("recidiviz user for a stateCode with restrictions", () => {
      it("returns true", () => {
        expect(
          restrictAccessForRecidivizUser({
            requestStateCode: "US_MO",
            userStateCode: "recidiviz",
            userRestrictions: ["24"],
          })
        );
      });
    });

    describe("US_MO user with restrictions", () => {
      it("returns false", () => {
        expect(
          restrictAccessForRecidivizUser({
            requestStateCode: "US_MO",
            userStateCode: "US_MO",
            userRestrictions: ["04"],
          })
        );
      });
    });

    describe("US_MO user without restrictions", () => {
      it("returns false", () => {
        expect(
          restrictAccessForRecidivizUser({
            requestStateCode: "US_MO",
            userStateCode: "US_MO",
            userRestrictions: undefined,
          })
        );
      });
    });

    describe("US_PA user without restrictions", () => {
      it("returns false", () => {
        expect(
          restrictAccessForRecidivizUser({
            requestStateCode: "US_PA",
            userStateCode: "US_PA",
            userRestrictions: undefined,
          })
        );
      });
    });
  });
});
