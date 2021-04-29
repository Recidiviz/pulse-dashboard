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
  autorun,
  reaction,
  observable,
  action,
  toJS,
} from "mobx";
import uniqBy from "lodash/uniqBy";
import {
  ADMISSION_TYPE,
  CHARGE_CATEGORY,
  METRIC_PERIOD_MONTHS,
  REPORTED_VIOLATIONS,
  SUPERVISION_LEVEL,
  SUPERVISION_TYPE,
  VIOLATION_TYPE,
  LEVEL_2_SUPERVISION_LOCATION,
  LEVEL_1_SUPERVISION_LOCATION,
} from "../utils/constants";
import filterOptionsMap from "../../RootStore/TenantStore/filterOptions";
import { compareStrings } from "./utils";
import { generateNestedOptions } from "./utils/districtOptions";
import getFilters from "../../utils/getFilterDescription";
import getViolation from "./utils/getViolationTypeDescription";

export const allOption = { label: "ALL", value: "All", secondaryValue: "All" };

export default class FiltersStore {
  rootStore;

  filters = observable.map();

  constructor({ rootStore }) {
    makeAutoObservable(this, {
      defaultFilterValues: computed,
      filterOptions: computed,
      districtFilterOptions: computed,
      setFilters: action,
    });

    this.rootStore = rootStore;

    reaction(
      () =>
        this.rootStore.currentTenantId &&
        this.rootStore.tenantStore.isLanternTenant,
      (currentTenantId, previousTenantId) => {
        if (currentTenantId !== previousTenantId) {
          this.filters.clear();
          this.setFilters(this.defaultFilterValues);
        }
      }
    );

    autorun(() => {
      if (this.rootStore.tenantStore.isLanternTenant) {
        this.setFilters(this.defaultFilterValues);
      }
    });
  }

  get defaultFilterValues() {
    const { districtKeys } = this.rootStore.districtsStore;
    if (!this.filterOptions || !districtKeys || !districtKeys.filterKey)
      return {};
    return {
      [METRIC_PERIOD_MONTHS]: this.filterOptions[METRIC_PERIOD_MONTHS]
        .defaultValue,
      [CHARGE_CATEGORY]: this.filterOptions[CHARGE_CATEGORY].defaultValue,
      [REPORTED_VIOLATIONS]: this.filterOptions[REPORTED_VIOLATIONS]
        .defaultValue,
      [VIOLATION_TYPE]: this.filterOptions[VIOLATION_TYPE].defaultValue,
      [SUPERVISION_TYPE]: this.filterOptions[SUPERVISION_TYPE].defaultValue,
      [SUPERVISION_LEVEL]: this.filterOptions[SUPERVISION_LEVEL].defaultValue,
      [LEVEL_1_SUPERVISION_LOCATION]: [
        this.filterOptions[LEVEL_1_SUPERVISION_LOCATION].defaultValue,
      ],
      [LEVEL_2_SUPERVISION_LOCATION]: [
        this.filterOptions[LEVEL_2_SUPERVISION_LOCATION].defaultValue,
      ],
      [ADMISSION_TYPE]: this.filterOptions[ADMISSION_TYPE].defaultValue,
      ...{
        [districtKeys.filterKey]: this.rootStore.userRestrictedAccessStore
          .hasRestrictedDistricts
          ? this.rootStore.userRestrictedAccessStore.restrictedDistricts
          : [this.filterOptions[districtKeys.filterKey].defaultValue],
      },
    };
  }

  get filterOptions() {
    return {
      ...filterOptionsMap[this.rootStore.currentTenantId],
      ...this.districtFilterOptions,
    };
  }

  get districtFilterOptions() {
    const { districtKeys } = this.rootStore.districtsStore;
    if (!districtKeys) return {};
    if (this.rootStore.userRestrictedAccessStore.hasRestrictedDistricts) {
      return {
        [districtKeys.filterKey]: {
          options: this.restrictedDistrictOptions,
        },
      };
    }
    return {
      [districtKeys.filterKey]: {
        defaultValue: "All",
        options: [allOption].concat(this.districts),
      },
    };
  }

  get restrictedDistrictOptions() {
    return this.rootStore.userRestrictedAccessStore.restrictedDistricts
      .slice()
      .sort()
      .map((district) => {
        return {
          value: district,
          label: district,
        };
      });
  }

  get districts() {
    const { apiData, districtKeys } = this.rootStore.districtsStore;

    if (!apiData || !apiData.data) return [];

    const districts = apiData.data;
    const { primaryLabelKey, secondaryLabelKey, valueKey } = districtKeys;

    if (secondaryLabelKey) {
      return generateNestedOptions([...districts], districtKeys);
    }
    return uniqBy(districts, valueKey)
      .map((district) => {
        return {
          value: district[valueKey],
          label: district[primaryLabelKey],
        };
      })
      .sort(compareStrings("label"));
  }

  setFilters(updatedFilters) {
    this.filters.merge(updatedFilters);
  }

  get filtersDescriptions() {
    const filters = toJS(this.filters);
    const enabledFilters = [...filters.entries()].reduce(
      (acc, [key, value]) => {
        if (this.filterOptions[key].componentEnabled !== false)
          acc[key] = value;
        return acc;
      },
      {}
    );
    return {
      filtersDescription: getFilters(enabledFilters),
      violationTypeDescription: getViolation(enabledFilters),
    };
  }
}
