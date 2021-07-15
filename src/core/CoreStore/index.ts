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

import type TenantStore from "../../RootStore/TenantStore";
import type UserStore from "../../RootStore/UserStore";
import { TenantId } from "../models/types";
import { PopulationFilterValues } from "../types/filters";
import { CORE_VIEWS, CoreView, getViewFromPathname } from "../views";
import FiltersStore from "./FiltersStore";
import MetricsStore from "./MetricsStore";
import PageProjectionsStore from "./PageProjectionsStore";
import PageVitalsStore from "./PageVitalsStore";

interface CoreStoreProps {
  userStore: UserStore;
  tenantStore: TenantStore;
}

export default class CoreStore {
  userStore: UserStore;

  tenantStore: TenantStore;

  filtersStore: FiltersStore;

  metricsStore: MetricsStore;

  pageVitalsStore: PageVitalsStore;

  pageProjectionsStore: PageProjectionsStore;

  view: CoreView = CORE_VIEWS.facilities;

  constructor({ userStore, tenantStore }: CoreStoreProps) {
    makeAutoObservable(this);

    this.userStore = userStore;

    this.tenantStore = tenantStore;

    this.filtersStore = new FiltersStore({ rootStore: this });

    this.metricsStore = new MetricsStore({ rootStore: this });

    this.pageVitalsStore = new PageVitalsStore({
      rootStore: this,
    });

    this.pageProjectionsStore = new PageProjectionsStore({
      rootStore: this,
    });

    this.setView = this.setView.bind(this);
  }

  setView(pathname: string): void {
    this.view = getViewFromPathname(pathname);
  }

  get filters(): PopulationFilterValues {
    return this.filtersStore.filters;
  }

  get currentTenantId(): TenantId | undefined {
    if (!this.tenantStore.currentTenantId) return undefined;
    return this.tenantStore.currentTenantId as TenantId;
  }
}
