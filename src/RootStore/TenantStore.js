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

import { makeAutoObservable } from "mobx";

import { useAuth0 } from "../react-auth0-spa";
import {
  getAvailableStateCodes,
  doesUserHaveAccess,
} from "../utils/authentication/user";
import { LANTERN_TENANTS } from "../views/tenants/utils/lanternTenants";

export const CURRENT_TENANT_IN_SESSION = "adminUserCurrentTenantInSession";

/*
 * Returns the current state that should be viewed. This is retrieved from
 * the sessionStorage cache if already set. Otherwise, picks the first available state in ABC order.
 */
function getTenantIdFromUser(user) {
  const fromStorage = sessionStorage.getItem(CURRENT_TENANT_IN_SESSION);
  if (user) {
    const availableStateCodes = getAvailableStateCodes(user);
    if (fromStorage && doesUserHaveAccess(user, fromStorage)) {
      return fromStorage;
    }
    return availableStateCodes[0];
  }

  return fromStorage;
}

export default class TenantStore {
  rootStore;

  currentTenantId = LANTERN_TENANTS[0];

  user;

  constructor({ rootStore }) {
    makeAutoObservable(this);

    this.rootStore = rootStore;

    // TODO create a UserStore and setCurrentTenantId on line 63
    // as a reaction to the user being updated, rather than setting
    // default currentTenantId on line 49
    const { user } = useAuth0();

    this.setCurrentTenantId(getTenantIdFromUser(user));
  }

  setCurrentTenantId(tenantId) {
    this.currentTenantId = tenantId;
    sessionStorage.setItem(CURRENT_TENANT_IN_SESSION, tenantId);
  }
}
