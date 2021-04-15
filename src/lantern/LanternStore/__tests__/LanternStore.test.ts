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
import LanternStore from "..";

jest.mock("../../../api/metrics");
jest.mock("../DataStore/DataStore");
jest.mock("../../../RootStore/TenantStore", () => {
  return jest.fn().mockImplementation(() => {
    return { currentTenantId: "US_MO", methodology: {} };
  });
});
jest.mock("../../../RootStore/UserStore", () => {
  return jest.fn().mockImplementation(() => {
    return { user: {} };
  });
});

let rootStore: LanternStore;

describe("RootStore", () => {
  beforeEach(() => {
    rootStore = new LanternStore(RootStore);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("contains a FiltersStore", () => {
    expect(rootStore.filtersStore).toBeDefined();
  });

  it("contains a TenantStore", () => {
    expect(rootStore.tenantStore).toBeDefined();
  });

  it("contains a UserStore", () => {
    expect(rootStore.userStore).toBeDefined();
  });

  it("contains a UserRestrictedAccessStore", () => {
    expect(rootStore.userRestrictedAccessStore).toBeDefined();
  });

  it("contains a currentTenantId", () => {
    expect(rootStore.currentTenantId).toBeDefined();
  });

  it("contains filters", () => {
    expect(rootStore.filters).toBeDefined();
  });

  it("contains methodology", () => {
    expect(rootStore.methodology).toBeDefined();
  });

  it("contains the DataStore", () => {
    expect(rootStore.dataStore).toBeDefined();
  });

  it("contains the DistrictsStore", () => {
    expect(rootStore.districtsStore).toBeDefined();
  });

  it("contains a user", () => {
    expect(rootStore.user).toBeDefined();
  });
});
