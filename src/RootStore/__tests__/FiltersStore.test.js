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
import { LANTERN_TENANTS } from "../../views/tenants/utils/lanternTenants";

jest.mock("../../StoreProvider");

let rootStore;

describe("FiltersStore", () => {
  const defaultFilters = {
    chargeCategory: "All",
    district: ["All"],
    metricPeriodMonths: "12",
    reportedViolations: "All",
    supervisionLevel: "All",
    supervisionType: "All",
    violationType: "All",
  };

  describe("filters", () => {
    it("are set correctly by default", () => {
      LANTERN_TENANTS.forEach((tenantId) => {
        rootStore = new RootStore();
        runInAction(() => {
          rootStore.tenantStore.currentTenantId = tenantId;
        });

        expect(rootStore.filtersStore.defaultFilters).toEqual(defaultFilters);
      });
    });

    it("sets the defaultFilters to restrictedDistrict if it exists", () => {
      const userDistrict = "99";

      rootStore = new RootStore();
      runInAction(() => {
        rootStore.tenantStore.currentTenantId = "US_MO";
        rootStore.userStore.restrictedDistrict = userDistrict;
      });

      expect(rootStore.filtersStore.defaultFilters.district).toEqual([
        userDistrict,
      ]);
    });
  });

  describe("districts filter", () => {
    let filtersStore;
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
          rootStore.districtsStore.isLoading = true;
        });
        expect(filtersStore.districtFilterOptions).toEqual([]);
        expect(filtersStore.districtsIsLoading).toEqual(true);
      });
    });

    describe("when districts are loaded", () => {
      beforeEach(() => {
        runInAction(() => {
          rootStore.districtsStore.apiData = { data: mockDistricts };
          rootStore.districtsStore.isLoading = false;
        });
      });

      it("sets the districtFilterOptions to sorted unique values", () => {
        runInAction(() => {
          rootStore.tenantStore.currentTenantId = "US_PA";
        });
        expect(filtersStore.districtFilterOptions).toEqual([
          { value: "ABCD-Level-2", label: "ABCD-Level-2" },
          { value: "TCSTL-Level-2", label: "TCSTL-Level-2" },
        ]);
      });

      it("uses the district keys defined for the tenant", () => {
        runInAction(() => {
          rootStore.tenantStore.currentTenantId = "US_MO";
        });
        expect(filtersStore.districtFilterOptions).toEqual([
          { value: "ABCD-Level-1", label: "ABCD-Level-1" },
          { value: "SLCRC-Level-1", label: "SLCRC-Level-1" },
          { value: "TCSTL-Level-1", label: "TCSTL-Level-1" },
        ]);
      });
    });
  });
});
