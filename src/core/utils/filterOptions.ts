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
import { CORE_VIEWS } from "../views";
import { METRIC_TYPES, FILTER_TYPES } from "./constants";
import { US_ID } from "../../RootStore/TenantStore/coreTenants";
import {
  FilterOption,
  PopulationFilters,
  SetPopulationFilters,
  PopulationFilterValues,
} from "../types/filters";

export const metricTypeOptions = [
  { label: "Counts", value: METRIC_TYPES.COUNTS },
  { label: "Rates", value: METRIC_TYPES.RATES },
];
export const defaultMetricType = metricTypeOptions[0].value;

export const metricPeriodOptions = [
  { label: "3 years", value: "36" },
  { label: "1 year", value: "12" },
  { label: "6 months", value: "6" },
  { label: "3 months", value: "3" },
  { label: "1 month", value: "1" },
];

export const defaultMetricPeriodOption = metricPeriodOptions[1];
export const defaultMetricPeriod = defaultMetricPeriodOption.value;

export const supervisionTypeOptions = [
  { label: "All", value: "all" },
  { label: "Probation", value: "probation" },
  { label: "Parole", value: "parole" },
];
export const defaultSupervisionTypeOption = supervisionTypeOptions[0];
export const defaultSupervisionType = defaultSupervisionTypeOption.value;

export const defaultDistrictOption = { label: "All", value: "all" };
export const defaultDistrict = [defaultDistrictOption.value];

export const getFilterOption = (
  value: string,
  options: FilterOption[]
): FilterOption =>
  options.find((option) => option.value === value) ?? options[0];

const setFilters = (
  filterKey: keyof PopulationFilters
): SetPopulationFilters => (filtersStore) => (option) => {
  filtersStore.setFilters({ [filterKey]: option.value });
};

// TODO(#940): Move width styling for filter to CSS
export const PopulationFilterOptions: PopulationFilters = {
  [FILTER_TYPES.TIME_PERIOD]: {
    type: FILTER_TYPES.TIME_PERIOD,
    title: "Time Period",
    width: "8rem",
    setFilters: setFilters(FILTER_TYPES.TIME_PERIOD),
    options: [
      { label: "5 years", value: "60" },
      { label: "2 years", value: "24" },
      { label: "1 year", value: "12" },
      { label: "6 months", value: "6" },
      { label: "1 month", value: "1" },
    ],
    get defaultOption(): FilterOption {
      return this.options[3];
    },
    get defaultValue(): string {
      return this.defaultOption.value;
    },
    enabledViews: [CORE_VIEWS.community, CORE_VIEWS.facilities],
  },
  [FILTER_TYPES.GENDER]: {
    type: FILTER_TYPES.GENDER,
    title: "Gender",
    width: "7rem",
    setFilters: setFilters(FILTER_TYPES.GENDER),
    options: [
      { label: "All", value: "all" },
      { label: "Female", value: "FEMALE" },
      { label: "Male", value: "MALE" },
    ],
    get defaultOption(): FilterOption {
      return this.options[0];
    },
    get defaultValue(): string {
      return this.defaultOption.value;
    },
    enabledViews: [CORE_VIEWS.community, CORE_VIEWS.facilities],
  },
  [FILTER_TYPES.LEGAL_STATUS]: {
    type: FILTER_TYPES.LEGAL_STATUS,
    title: "Legal Status",
    width: "8.5rem",
    setFilters: setFilters(FILTER_TYPES.LEGAL_STATUS),
    options: [
      { label: "All", value: "all" },
      { label: "Rider", value: "TREATMENT_IN_PRISON" },
      { label: "Termer", value: "GENERAL" },
      { label: "Parole Violator", value: "PAROLE_BOARD_HOLD" },
    ],
    get defaultOption(): FilterOption {
      return this.options[0];
    },
    get defaultValue(): string {
      return this.defaultOption.value;
    },
    enabledViews: [CORE_VIEWS.facilities],
  },
  [FILTER_TYPES.SUPERVISION_TYPE]: {
    type: FILTER_TYPES.SUPERVISION_TYPE,
    title: "Supervision Type",
    width: "8.5rem",
    setFilters: setFilters(FILTER_TYPES.SUPERVISION_TYPE),
    options: [
      { label: "All", value: "all" },
      { label: "Probation", value: "PROBATION" },
      { label: "Parole/Dual", value: "PAROLE" },
    ],
    get defaultOption(): FilterOption {
      return this.options[0];
    },
    get defaultValue(): string {
      return this.defaultOption.value;
    },
    enabledViews: [CORE_VIEWS.community],
  },
};

export const defaultPopulationFilterValues: PopulationFilterValues = {
  [FILTER_TYPES.TIME_PERIOD]:
    PopulationFilterOptions[FILTER_TYPES.TIME_PERIOD].defaultValue,
  [FILTER_TYPES.GENDER]:
    PopulationFilterOptions[FILTER_TYPES.GENDER].defaultValue,
  [FILTER_TYPES.LEGAL_STATUS]:
    PopulationFilterOptions[FILTER_TYPES.LEGAL_STATUS].defaultValue,
  [FILTER_TYPES.SUPERVISION_TYPE]:
    PopulationFilterOptions[FILTER_TYPES.SUPERVISION_TYPE].defaultValue,
};

export default {
  [US_ID]: PopulationFilterOptions,
} as const;
