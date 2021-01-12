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

import {
  makeAutoObservable,
  computed,
  action,
  autorun,
  observable,
} from "mobx";

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

export default class FiltersStore {
  rootStore;

  filters = observable.map({
    metricPeriodMonths: "",
    chargeCategory: "",
    reportedViolation: "",
    violationtype: "",
    supervisionLevel: "",
    admissionType: "",
    district: "",
  });

  restrictedDistrict = undefined;

  constructor({ rootStore }) {
    makeAutoObservable(this, {
      defaultFilters: computed,
      filterOptions: computed,
      setFilters: action,
      filters: observable,
    });

    this.rootStore = rootStore;

    autorun(() => {
      this.setFilters(this.defaultFilters);
    });
  }

  get defaultFilters() {
    return {
      [METRIC_PERIOD_MONTHS]: this.filterOptions[METRIC_PERIOD_MONTHS]
        .defaultValue,
      [CHARGE_CATEGORY]: this.filterOptions[CHARGE_CATEGORY].defaultValue,
      [REPORTED_VIOLATIONS]: this.filterOptions[REPORTED_VIOLATIONS]
        .defaultValue,
      [VIOLATION_TYPE]: this.filterOptions[VIOLATION_TYPE].defaultValue,
      [SUPERVISION_TYPE]: this.filterOptions[SUPERVISION_TYPE].defaultValue,
      [SUPERVISION_LEVEL]: this.filterOptions[SUPERVISION_LEVEL].defaultValue,
      ...(this.filterOptions[ADMISSION_TYPE].filterEnabled
        ? { [ADMISSION_TYPE]: this.filterOptions[ADMISSION_TYPE].defaultValue }
        : {}),
      [DISTRICT]: [this.filterOptions[DISTRICT].defaultValue],
    };
  }

  get filterOptions() {
    return filterOptionsMap[this.rootStore.currentTenantId];
  }

  setFilters(updatedFilters) {
    this.filters = { ...this.filters, ...updatedFilters };
  }

  setRestrictedDistrict(restrictedDistrict) {
    this.restrictedDistrict = restrictedDistrict;
    this.setFilters({ ...this.filters, ...{ district: [restrictedDistrict] } });
  }
}
