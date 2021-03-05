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
} from "../lantern/utils/constants";
import filterOptionsMap from "./TenantStore/filterOptions";
import { compareStrings } from "./utils";
import { generateNestedOptions } from "./utils/districtOptions";

export default class FiltersStore {
  rootStore;

  filters = observable.map();

  restrictedDistrict;

  constructor({ rootStore }) {
    makeAutoObservable(this, {
      defaultFilterValues: computed,
      filterOptions: computed,
      districtFilterOptions: computed,
      setFilters: action,
    });

    this.rootStore = rootStore;

    reaction(
      () => this.rootStore.currentTenantId,
      (currentTenantId, previousTenantId) => {
        if (currentTenantId !== previousTenantId) {
          this.filters.clear();
          this.setFilters(this.defaultFilterValues);
        }
      }
    );

    autorun(() => {
      this.setFilters(this.defaultFilterValues);
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
        [districtKeys.filterKey]: [
          this.rootStore.userStore.restrictedDistrict ||
            this.filterOptions[districtKeys.filterKey].defaultValue,
        ],
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
    return {
      [districtKeys.filterKey]: {
        defaultValue: "All",
        options: this.districts,
      },
    };
  }

  get districts() {
    // TODO #798: Use apiData.data from districts store when supervision locations are
    // filtered on the backend
    const { filteredDistricts, districtKeys } = this.rootStore.districtsStore;
    if (!filteredDistricts) return [];
    const { primaryLabelKey, secondaryLabelKey, valueKey } = districtKeys;

    if (secondaryLabelKey) {
      return generateNestedOptions([...filteredDistricts], districtKeys);
    }
    return uniqBy(filteredDistricts, valueKey)
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
}
