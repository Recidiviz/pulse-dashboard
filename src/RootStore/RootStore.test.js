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
import RootStore from "./RootStore";

let rootStore;
let stateCode;

describe("RootStore", () => {
  beforeEach(() => {
    stateCode = "us_mo";
    rootStore = new RootStore({ stateCode });
  });

  it("contains a FiltersStore", () => {
    expect(rootStore.filtersStore).toBeDefined();
  });
});

describe("FiltersStore", () => {
  const defaultFilters = {
    chargeCategory: "All",
    district: ["All"],
    metricPeriodMonths: "12",
    reportedViolations: "",
    supervisionLevel: "All",
    supervisionType: "All",
    violationType: "",
  };

  describe("filters", () => {
    it("are set correctly by default", () => {
      ["us_mo", "us_pa"].forEach((stateCode) => {
        rootStore = new RootStore({ stateCode });
        expect(expect(rootStore.filtersStore.filters).toEqual(defaultFilters));
      });
    });
  });

  describe("setRestrictedDistrict", () => {
    it("sets the restrictedDistrict and updates filters", () => {
      const restrictedDistrict = "district 1";
      rootStore = new RootStore({ stateCode });
      rootStore.filtersStore.setRestrictedDistrict(restrictedDistrict);
      expect(
        expect(rootStore.filtersStore.restrictedDistrict).toEqual(
          restrictedDistrict
        )
      );
      expect(
        expect(rootStore.filtersStore.filters.district).toEqual([
          restrictedDistrict,
        ])
      );
    });
  });
});
