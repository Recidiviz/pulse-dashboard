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
} from "mobx";

import { callMetricsApi } from "../../api/metrics/metricsClient";
import { processResponseData, getQueryStringFromFilters } from "./helpers";

/**
 * BaseDataStore is an abstract class that should never be directly instantiated.
 * It acts as a parent class to all the other data stores.
 */
export default class BaseDataStore {
  rootStore;

  isLoading = true;

  isError = false;

  apiData = [];

  filteredData = [];

  metadata = {};

  file;

  eagerExpand = false;

  constructor({ rootStore, file }) {
    makeObservable(this, {
      fetchData: flow,
      apiData: observable.shallow,
      filteredData: observable.shallow,
      queryFilters: computed,
      metadata: false,
      isLoading: true,
      isError: true,
      eagerExpand: true,
    });

    this.file = file;

    this.rootStore = rootStore;

    autorun(() => {
      const { userStore } = this.rootStore;

      if (userStore && !userStore.isLoading) {
        this.fetchData(this.queryFilters);
      }
    });
  }

  get queryFilters() {
    return getQueryStringFromFilters(this.filters);
  }

  get filters() {
    return Object.fromEntries(toJS(this.rootStore.filters));
  }

  get getTokenSilently() {
    return this.rootStore.userStore.getTokenSilently;
  }

  *fetchData(queryString) {
    const endpoint = `${this.rootStore.currentTenantId}/newRevocations/${this.file}${queryString}`;
    try {
      this.isLoading = true;
      const responseData = yield callMetricsApi(
        endpoint,
        this.getTokenSilently
      );
      const processedData = processResponseData(
        responseData,
        this.file,
        this.eagerExpand
      );
      this.apiData = processedData.data;
      this.metadata = processedData.metadata;
      this.filteredData = this.filterData(processedData);
      this.isLoading = false;
      this.isError = false;
    } catch (error) {
      console.error(error);
      this.isError = true;
      this.isLoading = false;
    }
  }

  filterData() {
    console.error(`filterData must be defined in the subclass.`);
    this.filteredData = [];
  }
}
