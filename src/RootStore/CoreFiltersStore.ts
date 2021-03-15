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
import { makeAutoObservable, observable, action, set } from "mobx";
import { metricPeriodOptions as timePeriodOptions } from "../core/utils/filterOptions";
import type RootStore from ".";

export type Filters = {
  [k: string]: any;
  timePeriod: string;
};

export type FilterKeys = keyof Filters;

const defaultFilters: Filters = {
  timePeriod: timePeriodOptions[4].value,
} as const;

export default class CoreFiltersStore {
  rootStore;

  filters: Filters = defaultFilters;

  constructor({ rootStore }: { rootStore: RootStore }) {
    makeAutoObservable(this, {
      filters: observable,
      setFilters: action,
    });

    this.rootStore = rootStore;
  }

  setFilters(updatedFilters: Partial<Filters>): void {
    Object.keys(updatedFilters).forEach((filterKey) => {
      set(this.filters, filterKey, updatedFilters[filterKey]);
    });
  }
}
