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

import { runInAction } from "mobx";

import RootStore from "../RootStore";
import { LANTERN_TENANTS } from "../../views/tenants/utils/lanternTenants";

jest.mock("../../StoreProvider");

let rootStore;

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
        rootStore.userStore.restrictedDistrict = userDistrict;
      });

      expect(rootStore.filtersStore.defaultFilters.district).toEqual([
        userDistrict,
      ]);
    });
  });
});
