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

import { computed, makeObservable, ObservableMap } from "mobx";

import type UserStore from "../../RootStore/UserStore";
import type TenantStore from "../../RootStore/TenantStore";
import UserRestrictedAccessStore from "./UserRestrictedAccessStore";
import FiltersStore from "./FiltersStore";
import DataStore from "./DataStore/DataStore";
import DistrictsStore from "./DistrictsStore";
import { TenantId } from "../../RootStore/types";

interface LanternStoreProps {
  userStore: UserStore;
  tenantStore: TenantStore;
}

export default class LanternStore {
  userStore: UserStore;

  tenantStore: TenantStore;

  userRestrictedAccessStore: UserRestrictedAccessStore;

  filtersStore: FiltersStore;

  dataStore: DataStore;

  districtsStore: DistrictsStore;

  constructor({ userStore, tenantStore }: LanternStoreProps) {
    makeObservable(this, {
      filters: computed,
      currentTenantId: computed,
      user: computed,
    });

    this.userStore = userStore;

    this.tenantStore = tenantStore;

    this.districtsStore = new DistrictsStore({
      rootStore: this,
    });

    this.userRestrictedAccessStore = new UserRestrictedAccessStore({
      rootStore: this,
    });

    this.filtersStore = new FiltersStore({ rootStore: this });

    this.dataStore = new DataStore({ rootStore: this });

    this.userRestrictedAccessStore.verifyUserRestrictions();
  }

  get filters(): ObservableMap<any, any> {
    return this.filtersStore.filters;
  }

  get currentTenantId(): TenantId | undefined {
    if (!this.tenantStore.currentTenantId) return undefined;
    return this.tenantStore.currentTenantId;
  }

  get user(): any {
    return this.userStore.user;
  }

  get userRestrictions(): string[] {
    return this.userStore.userRestrictions;
  }

  get methodology(): any {
    return this.tenantStore.methodology;
  }
}
