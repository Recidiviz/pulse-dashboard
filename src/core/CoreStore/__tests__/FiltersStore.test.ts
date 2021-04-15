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
import RootStore from "../../../RootStore";
import CoreStore from "..";
import { defaultPopulationFilterValues } from "../../utils/filterOptions";

let coreStore: CoreStore;

jest.mock("../../../RootStore/UserStore", () => {
  return jest.fn().mockImplementation(() => ({
    user: {},
  }));
});

jest.mock("../../../RootStore/TenantStore", () => {
  return jest.fn().mockImplementation(() => ({
    currentTenantId: "US_ND",
  }));
});

describe("FiltersStore", () => {
  beforeEach(() => {
    coreStore = new CoreStore(RootStore);
  });

  describe("default filter values", () => {
    it("are set correctly by default", () => {
      expect(coreStore.filtersStore.filters).toEqual(
        defaultPopulationFilterValues
      );
    });
  });

  describe("setFilters", () => {
    it("updates the filter values", () => {
      const expected = {
        ...defaultPopulationFilterValues,
        gender: "FEMALE",
      };
      coreStore.filtersStore.setFilters({ gender: "FEMALE" });
      expect(coreStore.filtersStore.filters).toEqual(expected);
    });
  });

  describe("timePeriodLabel", () => {
    it("returns the time period label", () => {
      coreStore.filtersStore.setFilters({ timePeriod: "3" });
      expect(coreStore.filtersStore.timePeriodLabel).toEqual("3 months");
    });
  });
});
