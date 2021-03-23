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
import type CorePopulationFiltersStore from "../../RootStore/CorePopulationFiltersStore";
import { FILTER_TYPES } from "../utils/constants";

export type PopulationFilterValues = {
  [key in keyof PopulationFilters]: string;
};

export type SetPopulationFilters = (
  filtersStore: CorePopulationFiltersStore
) => (option: FilterOption) => void;

export type FilterOption = {
  label: string;
  value: any;
};

export interface PopulationFilters {
  [FILTER_TYPES.TIME_PERIOD]: PopulationFilter;
  [FILTER_TYPES.GENDER]: PopulationFilter;
  [FILTER_TYPES.LEGAL_STATUS]: PopulationFilter;
  [FILTER_TYPES.SUPERVISION_TYPE]: PopulationFilter;
}

type PopulationFilter = {
  type: keyof PopulationFilters;
  title: string;
  width: string;
  setFilters: SetPopulationFilters;
  options: FilterOption[];
  defaultOption: FilterOption;
  defaultValue: string;
  enabledViews: string[];
};
