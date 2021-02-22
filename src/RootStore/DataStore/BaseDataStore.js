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
import * as Sentry from "@sentry/react";

import { filterOptimizedDataFormat } from "shared-filters";
import { callMetricsApi, parseResponseByFileFormat } from "../../api/metrics";
import {
  getQueryStringFromFilters,
  dimensionManifestIncludesFilterValues,
} from "./helpers";
import {
  FILTER_TYPE_MAP,
  DISTRICT,
  LEVEL_1_SUPERVISION_LOCATION,
  LEVEL_2_SUPERVISION_LOCATION,
  METRIC_PERIOD_MONTHS,
} from "../../constants/filterTypes";

export const DEFAULT_IGNORED_DIMENSIONS = [
  LEVEL_1_SUPERVISION_LOCATION,
  LEVEL_2_SUPERVISION_LOCATION,
  DISTRICT,
  METRIC_PERIOD_MONTHS,
];

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

  isStatePopulationLoading = true;

  isStatePopulationError = false;

  statePopulationData = {};

  statePopulationFile = undefined;

  eagerExpand = false;

  treatCategoryAllAsAbsent = false;

  ignoredSubsetDimensions;

  constructor({
    rootStore,
    file,
    statePopulationFile,
    skippedFilters = [],
    treatCategoryAllAsAbsent = false,
    ignoredSubsetDimensions = [],
  }) {
    makeObservable(this, {
      fetchData: flow,
      fetchStatePopulationData: flow,
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
    this.statePopulationFile = statePopulationFile;
    this.skippedFilters = skippedFilters;
    this.treatCategoryAllAsAbsent = treatCategoryAllAsAbsent;
    this.ignoredSubsetDimensions = DEFAULT_IGNORED_DIMENSIONS.concat(
      ignoredSubsetDimensions
    );
    this.rootStore = rootStore;

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
        this.rootStore.userStore &&
        !this.rootStore.userStore.userIsLoading &&
        !this.rootStore.userStore.restrictedDistrictIsLoading
      ) {
        this.fetchData({
          tenantId: this.rootStore.currentTenantId,
        });
        this.fetchStatePopulationData({
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
    if (!this.apiData.metadata || !this.apiData.metadata.dimension_manifest)
      return null;

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

  filterData(apiData, dataFilter) {
    if (!apiData.data) return [];
    const { data, metadata } = apiData;
    const isExpandedFormat = !Array.isArray(data[0]);
    if (this.eagerExpand || isExpandedFormat) {
      return data.filter((item) => dataFilter(item));
    }
    return filterOptimizedDataFormat(data, metadata, dataFilter);
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
      this.apiData = parseResponseByFileFormat(
        responseData,
        this.file,
        this.eagerExpand
      );
      this.isLoading = false;
      this.isError = false;
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, (scope) => {
        scope.setContext("BaseDataStore.fetchData", {
          endpoint,
        });
      });
      this.isError = true;
      this.isLoading = false;
    }
  }

  *fetchStatePopulationData({ tenantId }) {
    if (!this.statePopulationFile) {
      this.isStatePopulationLoading = false;
      this.isStatePopulationError = false;
      return;
    }

    const endpoint = `${tenantId}/newRevocations/${this.statePopulationFile}`;
    try {
      this.isStatePopulationLoading = true;
      const responseData = yield callMetricsApi(
        endpoint,
        this.getTokenSilently
      );
      // The state population files will never be optimized format
      // so always use eagerExpand = true when processing response data
      const { data } = parseResponseByFileFormat(
        responseData,
        this.statePopulationFile,
        true
      );
      this.statePopulationData = data;
      this.isStatePopulationLoading = false;
      this.isStatePopulationError = false;
    } catch (error) {
      console.error(error);
      this.isStatePopulationError = true;
      this.isStatePopulationLoading = false;
    }
  }
}
