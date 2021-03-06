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
  action,
  computed,
  get,
  makeAutoObservable,
  observable,
  set,
} from "mobx";

import { PopulationFilters, PopulationFilterValues } from "../types/filters";
import { defaultPopulationFilterValues } from "../utils/filterOptions";
import { formatTimePeriodLabel } from "../utils/timePeriod";
import type CoreStore from ".";

export default class FiltersStore {
  rootStore;

  filters: PopulationFilterValues = defaultPopulationFilterValues;

  constructor({ rootStore }: { rootStore: CoreStore }) {
    makeAutoObservable(this, {
      filters: observable,
      timePeriodLabel: computed,
      setFilters: action,
    });

    this.rootStore = rootStore;
  }

  setFilters(updatedFilters: Partial<PopulationFilterValues>): void {
    Object.keys(updatedFilters).forEach((filterKey) => {
      set(
        this.filters,
        filterKey,
        updatedFilters[filterKey as keyof PopulationFilters]
      );
    });
  }

  get timePeriodLabel(): string {
    return formatTimePeriodLabel(get(this.filters, "timePeriod"));
  }
}
