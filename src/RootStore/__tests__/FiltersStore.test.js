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

import { runInAction } from "mobx";

import RootStore from "../RootStore";
import FiltersStore from "../FiltersStore";
import { LANTERN_TENANTS } from "../TenantStore/lanternTenants";

jest.mock("../../StoreProvider");

let rootStore;

function getDistrictFilterKey(tenantId) {
  if (tenantId === "US_MO") return "levelOneSupervisionLocation";
  if (tenantId === "US_PA") return "levelTwoSupervisionLocation";
  return "district";
}
const defaultFilters = {
  chargeCategory: "All",
  metricPeriodMonths: "12",
  reportedViolations: "All",
  supervisionLevel: "All",
  supervisionType: "All",
  violationType: "All",
  levelOneSupervisionLocation: ["All"],
  levelTwoSupervisionLocation: ["All"],
};

describe("FiltersStore", () => {
  describe("default filter values", () => {
    it("are set correctly by default", () => {
      LANTERN_TENANTS.forEach((tenantId) => {
        rootStore = new RootStore();
        runInAction(() => {
          rootStore.districtsStore.isLoading = false;

          rootStore.tenantStore.currentTenantId = tenantId;
        });

        expect(rootStore.filtersStore.defaultFilterValues).toEqual(
          defaultFilters
        );
      });
    });

    it("sets the defaultFilters to restrictedDistrict if it exists", () => {
      const tenantId = "US_MO";
      const userDistrict = "99";

      rootStore = new RootStore();

      runInAction(() => {
        rootStore.tenantStore.currentTenantId = tenantId;
        rootStore.districtsStore.isLoading = false;
        rootStore.userStore.restrictedDistrict = userDistrict;
      });

      expect(
        rootStore.filtersStore.defaultFilterValues[
          getDistrictFilterKey(tenantId)
        ]
      ).toStrictEqual([userDistrict]);
    });

    it("clears the filters when switching tenants", () => {
      rootStore = new RootStore();

      // Set tenant to US_MO
      runInAction(() => {
        rootStore.districtsStore.isLoading = false;
        rootStore.tenantStore.currentTenantId = "US_MO";
      });

      // Expect default filters
      expect(rootStore.filtersStore.defaultFilterValues).toEqual(
        defaultFilters
      );

      // Set district filter for US_MO
      rootStore.filtersStore.setFilters({
        levelOneSupervisionLocation: ["01"],
      });

      // Expect level_1 filter set
      expect(
        Object.fromEntries(rootStore.filtersStore.filters)
          .levelOneSupervisionLocation
      ).toEqual(["01"]);

      // Switch tenant to US_PA
      runInAction(() => {
        rootStore.tenantStore.currentTenantId = "US_PA";
      });

      // Expect level_2 filter set to "All"
      expect(
        Object.fromEntries(rootStore.filtersStore.filters)
          .levelTwoSupervisionLocation
      ).toEqual(["All"]);

      // Expect level_1 filter to reset to "All"
      expect(
        Object.fromEntries(rootStore.filtersStore.filters)
          .levelOneSupervisionLocation
      ).toEqual(["All"]);
    });
  });

  describe("districts filter", () => {
    let filtersStore;
    const tenantId = "US_MO";
    const mockDistricts = [
      {
        level_2_supervision_location_external_id: "TCSTL-Level-2",
        level_2_supervision_location_name: "TCSTL-Level-2",
        level_1_supervision_location_external_id: "SLCRC-Level-1",
        level_1_supervision_location_name: "St. Louis Community Release Center",
      },
      {
        level_2_supervision_location_external_id: "TCSTL-Level-2",
        level_2_supervision_location_name: "TCSTL-Level-2",
        level_1_supervision_location_external_id: "TCSTL-Level-1",
        level_1_supervision_location_name: "Transition Center of St. Louis",
      },
      {
        level_2_supervision_location_external_id: "ABCD-Level-2",
        level_2_supervision_location_name: "ABCD-Level-2",
        level_1_supervision_location_external_id: "ABCD-Level-1",
        level_1_supervision_location_name: "ABC Location",
      },
    ];

    beforeEach(() => {
      rootStore = new RootStore();
      filtersStore = new FiltersStore({ rootStore });
    });

    describe("when districts are loading", () => {
      it("returns an empty array", () => {
        runInAction(() => {
          rootStore.tenantStore.currentTenantId = tenantId;
          rootStore.districtsStore.isLoading = true;
        });
        expect(
          filtersStore.filterOptions[getDistrictFilterKey(tenantId)].options
        ).toEqual([]);
        expect(filtersStore.districtsIsLoading).toEqual(true);
      });
    });

    describe("when districts are loaded", () => {
      it("sets the district filter options to sorted unique values", () => {
        runInAction(() => {
          rootStore.districtsStore.apiData = { data: mockDistricts };
          // TODO: Remove the filteredDistricts when supervision locations are filtered on backend
          rootStore.districtsStore.filteredDistricts = mockDistricts;
          rootStore.districtsStore.isLoading = false;
          rootStore.tenantStore.currentTenantId = "US_PA";
        });
        expect(
          filtersStore.filterOptions[getDistrictFilterKey("US_PA")].options
        ).toEqual([
          { value: "ABCD-Level-2", label: "ABCD-Level-2" },
          { value: "TCSTL-Level-2", label: "TCSTL-Level-2" },
        ]);
      });

      it("uses the district keys defined for the tenant", () => {
        runInAction(() => {
          rootStore.districtsStore.apiData = { data: mockDistricts };
          // TODO: Remove the filteredDistricts when supervision locations are filtered on backend
          rootStore.districtsStore.filteredDistricts = mockDistricts;
          rootStore.districtsStore.isLoading = false;
          rootStore.tenantStore.currentTenantId = "US_MO";
        });
        expect(
          filtersStore.filterOptions[getDistrictFilterKey("US_MO")].options
        ).toEqual([
          { value: "ABCD-Level-1", label: "ABCD-Level-1" },
          { value: "SLCRC-Level-1", label: "SLCRC-Level-1" },
          { value: "TCSTL-Level-1", label: "TCSTL-Level-1" },
        ]);
      });
    });
  });
});
