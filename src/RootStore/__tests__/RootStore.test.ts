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

import createAuth0Client from "@auth0/auth0-spa-js";

import RootStore from "..";

const METADATA_NAMESPACE = process.env.REACT_APP_METADATA_NAMESPACE;

jest.mock("@auth0/auth0-spa-js");
jest.mock("../../api/metrics");
jest.mock("../TenantStore", () => {
  return jest.fn().mockImplementation(() => ({
    currentTenantId: "US_MO",
  }));
});

describe("RootStore", () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it("contains a TenantStore", () => {
    expect(RootStore.tenantStore).toBeDefined();
  });

  it("contains a UserStore", () => {
    expect(RootStore.userStore).toBeDefined();
  });

  it("contains a currentTenantId", () => {
    expect(RootStore.currentTenantId).toBeDefined();
  });

  it("contains user", async () => {
    const metadataField = `${METADATA_NAMESPACE}app_metadata`;
    const user = {
      [metadataField]: { state_code: "US_MO" },
      email_verified: true,
    };
    (createAuth0Client as jest.Mock).mockResolvedValue({
      getUser: () => user,
      isAuthenticated: () => true,
    });

    await RootStore.userStore.authorize();

    expect(RootStore.user).toBeDefined();
  });
});
