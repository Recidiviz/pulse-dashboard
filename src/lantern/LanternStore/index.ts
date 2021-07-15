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

import { autorun, computed, makeObservable, ObservableMap } from "mobx";

import type TenantStore from "../../RootStore/TenantStore";
import { TenantId } from "../../RootStore/types";
import type UserStore from "../../RootStore/UserStore";
import DataStore from "./DataStore/DataStore";
import DistrictsStore from "./DistrictsStore";
import FiltersStore from "./FiltersStore";
import UserRestrictionsStore from "./UserRestrictionsStore";

interface LanternStoreProps {
  userStore: UserStore;
  tenantStore: TenantStore;
}

export default class LanternStore {
  userStore: UserStore;

  tenantStore: TenantStore;

  userRestrictionsStore: UserRestrictionsStore;

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

    this.userRestrictionsStore = new UserRestrictionsStore({
      rootStore: this,
    });

    this.filtersStore = new FiltersStore({ rootStore: this });

    this.dataStore = new DataStore({ rootStore: this });
    autorun(() => {
      if (
        !this.userStore.userIsLoading &&
        !this.districtsStore.isLoading &&
        this.tenantStore.enableUserRestrictions
      ) {
        this.userRestrictionsStore.verifyUserRestrictions();
      }
    });
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

  get methodology(): any {
    return this.tenantStore.methodology;
  }
}
