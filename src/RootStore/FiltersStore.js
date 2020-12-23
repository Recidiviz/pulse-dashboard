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

import { makeAutoObservable } from "mobx";

import {
  ADMISSION_TYPE,
  CHARGE_CATEGORY,
  DISTRICT,
  METRIC_PERIOD_MONTHS,
  REPORTED_VIOLATIONS,
  SUPERVISION_LEVEL,
  SUPERVISION_TYPE,
  VIOLATION_TYPE,
} from "../constants/filterTypes";
import filterOptionsMap from "../views/tenants/constants/filterOptions";

const defaultFilters = (filterOptions) => {
  return {
    [METRIC_PERIOD_MONTHS]: filterOptions[METRIC_PERIOD_MONTHS].defaultValue,
    [CHARGE_CATEGORY]: filterOptions[CHARGE_CATEGORY].defaultValue,
    [REPORTED_VIOLATIONS]: filterOptions[REPORTED_VIOLATIONS].defaultValue,
    [VIOLATION_TYPE]: filterOptions[VIOLATION_TYPE].defaultValue,
    [SUPERVISION_TYPE]: filterOptions[SUPERVISION_TYPE].defaultValue,
    [SUPERVISION_LEVEL]: filterOptions[SUPERVISION_LEVEL].defaultValue,
    ...(filterOptions[ADMISSION_TYPE].filterEnabled
      ? { [ADMISSION_TYPE]: filterOptions[ADMISSION_TYPE].defaultValue }
      : {}),
    [DISTRICT]: [filterOptions[DISTRICT].defaultValue],
  };
};

export default class FiltersStore {
  rootStore;

  filterOptions = {};

  filters = {};

  restrictedDistrict = undefined;

  constructor({ rootStore, stateCode }) {
    makeAutoObservable(this);

    this.rootStore = rootStore;
    this.filterOptions = filterOptionsMap[stateCode];
    this.filters = defaultFilters(this.filterOptions);
  }

  setFilters(newFilters) {
    this.filters = { ...newFilters };
  }

  setRestrictedDistrict(restrictedDistrict) {
    this.restrictedDistrict = restrictedDistrict;
    this.setFilters({ ...this.filters, ...{ district: [restrictedDistrict] } });
  }
}
