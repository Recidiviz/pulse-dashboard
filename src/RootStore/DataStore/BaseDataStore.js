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
  flow,
  makeObservable,
  observable,
  computed,
  toJS,
  autorun,
  reaction,
} from "mobx";

import { callMetricsApi } from "../../api/metrics/metricsClient";
import {
  processResponseData,
  getQueryStringFromFilters,
  dimensionManifestIncludesFilterValues,
} from "./helpers";
import { FILTER_TYPE_MAP, DISTRICT } from "../../constants/filterTypes";

/**
 * BaseDataStore is an abstract class that should never be directly instantiated.
 * It acts as a parent class to all the other data stores.
 */
export default class BaseDataStore {
  rootStore;

  isLoading = true;

  isError = false;

  apiData = {};

  file;

  eagerExpand = false;

  treatCategoryAllAsAbsent = false;

  ignoredSubsetDimensions;

  constructor({
    rootStore,
    file,
    skippedFilters = [],
    treatCategoryAllAsAbsent = false,
    ignoredSubsetDimensions = [DISTRICT],
  }) {
    makeObservable(this, {
      fetchData: flow,
      apiData: observable.ref,
      filteredData: computed,
      filtersQueryParams: computed,
      dimensionManifest: computed,
      shouldFetchNewSubsetFile: computed,
      isLoading: true,
      isError: true,
      eagerExpand: true,
    });

    this.file = file;
    this.skippedFilters = skippedFilters;
    this.treatCategoryAllAsAbsent = treatCategoryAllAsAbsent;
    this.ignoredSubsetDimensions = ignoredSubsetDimensions;
    this.rootStore = rootStore;

    const { userStore } = this.rootStore;

    reaction(
      () => this.shouldFetchNewSubsetFile,
      (shouldFetchNewSubsetFile) => {
        if (!this.isLoading && shouldFetchNewSubsetFile) {
          this.fetchData({
            tenantId: this.rootStore.currentTenantId,
          });
        }
      }
    );

    autorun(() => {
      if (
        userStore &&
        !userStore.userIsLoading &&
        !userStore.restrictedDistrictIsLoading
      ) {
        this.fetchData({
          tenantId: this.rootStore.currentTenantId,
        });
      }
    });
  }

  get shouldFetchNewSubsetFile() {
    return !dimensionManifestIncludesFilterValues({
      filters: this.filters,
      dimensionManifest: this.dimensionManifest,
      skippedFilters: this.skippedFilters,
      ignoredSubsetDimensions: this.ignoredSubsetDimensions,
      treatCategoryAllAsAbsent: this.treatCategoryAllAsAbsent,
    });
  }

  get filtersQueryParams() {
    return getQueryStringFromFilters(this.filters);
  }

  get filters() {
    return Object.fromEntries(toJS(this.rootStore.filters));
  }

  get getTokenSilently() {
    return this.rootStore.userStore.getTokenSilently;
  }

  get dimensionManifest() {
    if (!this.apiData.metadata) return null;

    return this.apiData.metadata.dimension_manifest.reduce((acc, dimension) => {
      const [name, values] = dimension;
      if (FILTER_TYPE_MAP[name]) {
        acc[FILTER_TYPE_MAP[name]] = values;
      }
      return acc;
    }, {});
  }

  get filteredData() {
    throw new Error(`filteredData should be defined in the subclass.`, this);
  }

  *fetchData({ tenantId }) {
    if (!this.rootStore?.tenantStore.isLanternTenant) {
      this.isLoading = false;
      this.isError = false;
      return;
    }
    const endpoint = `${tenantId}/newRevocations/${this.file}${this.filtersQueryParams}`;
    try {
      this.isLoading = true;
      const responseData = yield callMetricsApi(
        endpoint,
        this.getTokenSilently
      );
      this.apiData = processResponseData(
        responseData,
        this.file,
        this.eagerExpand
      );
      this.isLoading = false;
      this.isError = false;
    } catch (error) {
      console.error(error);
      this.isError = true;
      this.isLoading = false;
    }
  }
}
