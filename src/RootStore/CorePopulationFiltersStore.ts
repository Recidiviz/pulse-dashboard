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
import {
  makeAutoObservable,
  computed,
  observable,
  action,
  set,
  get,
} from "mobx";
import type RootStore from ".";
import filterOptions, {
  PopulationFilters,
  FilterKeys,
} from "../core/utils/filterOptions";
import { formatTimePeriodLabel } from "../core/utils/timePeriod";

export default class CorePopulationFiltersStore {
  rootStore;

  filterOptions = filterOptions.US_ID;

  filters: PopulationFilters = this.filterOptions.defaultFilterValues;

  constructor({ rootStore }: { rootStore: RootStore }) {
    makeAutoObservable(this, {
      filters: observable,
      timePeriodLabel: computed,
      setFilters: action,
    });

    this.rootStore = rootStore;
  }

  setFilters(updatedFilters: Partial<PopulationFilters>): void {
    Object.keys(updatedFilters).forEach((filterKey) => {
      set(this.filters, filterKey, updatedFilters[filterKey as FilterKeys]);
    });
  }

  get timePeriodLabel(): string {
    return formatTimePeriodLabel(get(this.filters, "timePeriod"));
  }
}
