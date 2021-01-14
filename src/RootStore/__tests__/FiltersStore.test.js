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

import { get } from "mobx";

import RootStore from "../RootStore";
import { useAuth0 } from "../../react-auth0-spa";
import { METADATA_NAMESPACE } from "../../utils/authentication/user";
import { LANTERN_TENANTS } from "../../views/tenants/utils/lanternTenants";
import { DISTRICT } from "../../constants/filterTypes";

jest.mock("../../react-auth0-spa");

let rootStore;
const metadataField = `${METADATA_NAMESPACE}app_metadata`;

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
      LANTERN_TENANTS.forEach((stateCode) => {
        const mockUser = { [metadataField]: { state_code: stateCode } };
        useAuth0.mockReturnValue({ user: mockUser });
        rootStore = new RootStore();

        expect(rootStore.filtersStore.defaultFilters).toEqual(defaultFilters);
      });
    });
  });

  describe("setRestrictedDistrict", () => {
    it("sets the restrictedDistrict and updates filters", () => {
      const restrictedDistrict = "district 1";
      rootStore = new RootStore();
      rootStore.filtersStore.setRestrictedDistrict(restrictedDistrict);

      expect(
        expect(rootStore.filtersStore.restrictedDistrict).toEqual(
          restrictedDistrict
        )
      );

      expect(
        expect(get(rootStore.filtersStore.filters, DISTRICT)).toEqual([
          restrictedDistrict,
        ])
      );
    });
  });
});
