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
import { makeAutoObservable, when } from "mobx";

import tenants from "../../tenants";
import type RootStore from "..";
import { LanternMethodology, LanternTenants, TenantId } from "../types";
import UserStore from "../UserStore";
import getDistrictKeyMap, { DistrictKeyMap } from "./districtKeyMappings";
import { LANTERN_TENANTS } from "./lanternTenants";
import methodology from "./methodology";

export const CURRENT_TENANT_IN_SESSION = "adminUserCurrentTenantInSession";

/*
 * Returns the current state that should be viewed. This is retrieved from
 * the sessionStorage cache if already set. Otherwise, picks the first available
 * state in alphabetical order.
 */
function getTenantIdFromUser(userStore: UserStore): TenantId {
  const { availableStateCodes, userHasAccess } = userStore;
  const storageStateCode = sessionStorage.getItem(
    CURRENT_TENANT_IN_SESSION
  ) as TenantId;
  if (userStore.user) {
    if (storageStateCode && userHasAccess(storageStateCode)) {
      return storageStateCode;
    }
    return availableStateCodes[0] as TenantId;
  }

  return storageStateCode;
}

export default class TenantStore {
  rootStore;

  currentTenantId?: TenantId;

  constructor({ rootStore }: { rootStore: typeof RootStore }) {
    makeAutoObservable(this);

    this.rootStore = rootStore;

    when(
      () => !this.rootStore.userStore.userIsLoading,
      () =>
        this.setCurrentTenantId(getTenantIdFromUser(this.rootStore.userStore))
    );
  }

  setCurrentTenantId(tenantId: TenantId): void {
    this.currentTenantId = tenantId;
    sessionStorage.setItem(CURRENT_TENANT_IN_SESSION, tenantId);
  }

  get isLanternTenant(): boolean {
    if (!this.currentTenantId) return false;
    const tenantId = this.currentTenantId as LanternTenants;
    return LANTERN_TENANTS.includes(tenantId);
  }

  get tenantMappings(): DistrictKeyMap {
    if (!this.currentTenantId) return {};
    return getDistrictKeyMap(this.currentTenantId);
  }

  get methodology(): LanternMethodology {
    if (!this.currentTenantId) return {};
    const tenantId = this.currentTenantId as LanternTenants;
    return methodology[tenantId];
  }

  get stateName(): string {
    if (!this.currentTenantId) return "";
    return tenants[this.currentTenantId].name;
  }

  get stateCode(): string {
    if (!this.currentTenantId) return "";
    return tenants[this.currentTenantId].stateCode;
  }

  get domain(): string | undefined {
    if (!this.currentTenantId) return "";
    return tenants[this.currentTenantId].domain;
  }

  get enableUserRestrictions(): boolean {
    if (!this.currentTenantId) return false;
    return (
      tenants[this.currentTenantId].enableUserRestrictions &&
      Array.isArray(this.rootStore.userStore.allowedSupervisionLocationIds) &&
      this.rootStore.userStore.allowedSupervisionLocationIds.length > 0
    );
  }
}
