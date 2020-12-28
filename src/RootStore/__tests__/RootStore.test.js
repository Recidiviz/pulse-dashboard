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
import RootStore from "../RootStore";
import { useAuth0 } from "../../react-auth0-spa";
import { US_MO } from "../../views/tenants/utils/lanternTenants";
import { METADATA_NAMESPACE } from "../../utils/authentication/user";

jest.mock("../../react-auth0-spa");

let rootStore;
const metadataField = `${METADATA_NAMESPACE}app_metadata`;
const user = { [metadataField]: { state_code: US_MO } };

describe("RootStore", () => {
  it("contains a TenantStore", () => {
    useAuth0.mockReturnValue({
      user,
      isAuthenticated: true,
      loading: false,
      loginWithRedirect: jest.fn(),
      getTokenSilently: jest.fn(),
    });

    rootStore = new RootStore();
    expect(rootStore.tenantStore).toBeDefined();
  });
});
