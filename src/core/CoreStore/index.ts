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
import { makeAutoObservable } from "mobx";

import FiltersStore from "./FiltersStore";
import type UserStore from "../../RootStore/UserStore";
import type TenantStore from "../../RootStore/TenantStore";
import { PopulationFilterValues } from "../types/filters";
import { TenantId } from "../models/types";
import MetricsStore from "./MetricsStore";
import VitalsPageStore from "./PageVitalsStore";

interface CoreStoreProps {
  userStore: UserStore;
  tenantStore: TenantStore;
}

export default class CoreStore {
  userStore: UserStore;

  tenantStore: TenantStore;

  filtersStore: FiltersStore;

  metricsStore: MetricsStore;

  vitalsPageStore: VitalsPageStore;

  constructor({ userStore, tenantStore }: CoreStoreProps) {
    makeAutoObservable(this);

    this.userStore = userStore;

    this.tenantStore = tenantStore;

    this.filtersStore = new FiltersStore({ rootStore: this });

    this.metricsStore = new MetricsStore({ rootStore: this });

    this.vitalsPageStore = new VitalsPageStore({ rootStore: this });
  }

  get filters(): PopulationFilterValues {
    return this.filtersStore.filters;
  }

  get currentTenantId(): TenantId | undefined {
    if (!this.tenantStore.currentTenantId) return undefined;
    return this.tenantStore.currentTenantId as TenantId;
  }
}
