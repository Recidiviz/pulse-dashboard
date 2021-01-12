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

import { makeAutoObservable, action } from "mobx";

import { useAuth0 } from "../react-auth0-spa";
import {
  getAvailableStateCodes,
  doesUserHaveAccess,
} from "../utils/authentication/user";

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
  // TODO figure out better default return
  return fromStorage || "US_MO";
}

export default class TenantStore {
  rootStore;

  // TODO figure out better default
  currentTenantId = "US_MO";

  user;

  constructor({ rootStore }) {
    makeAutoObservable(this, { setCurrentTenantId: action });

    this.rootStore = rootStore;

    const { user } = useAuth0();

    this.setCurrentTenantId(getTenantIdFromUser(user));
  }

  setCurrentTenantId(tenantId) {
    this.currentTenantId = tenantId;
    sessionStorage.setItem(CURRENT_TENANT_IN_SESSION, tenantId);
  }
}
