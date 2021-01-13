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

import { computed, makeObservable } from "mobx";

import FiltersStore from "./FiltersStore";
import TenantStore from "./TenantStore";
import DataStore from "./DataStore/DataStore";

export default class RootStore {
  filtersStore;

  tenantStore;

  stateCode;

  constructor() {
    makeObservable(this, { filters: computed, currentTenantId: computed });

    this.tenantStore = new TenantStore({ rootStore: this });
    this.filtersStore = new FiltersStore({ rootStore: this });
    this.dataStore = new DataStore({
      rootStore: this,
      filtersStore: this.filtersStore,
    });
  }

  get filters() {
    return this.filtersStore.filters;
  }

  get currentTenantId() {
    return this.tenantStore.currentTenantId;
  }
}
