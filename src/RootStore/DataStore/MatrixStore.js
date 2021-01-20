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
  makeAutoObservable,
  when,
  observable,
  computed,
  get,
  toJS,
  reaction,
} from "mobx";

import { callMetricsApi } from "../../api/metrics/metricsClient";
import { processResponseData } from "./helpers";
import { matchesTopLevelFilters } from "../../components/charts/new_revocations/helpers";
import { filterOptimizedDataFormat } from "../../utils/charts/dataFilters";
import { getQueryStringFromFilters } from "../../api/metrics/urlHelpers";

export default class MatrixStore {
  rootStore;

  isLoading = true;

  isError = false;

  apiData = [];

  filteredData = [];

  metadata = {};

  file = `revocations_matrix_cells`;

  eagerExpand = false;

  constructor({ rootStore }) {
    makeAutoObservable(this, {
      fetchData: flow,
      apiData: observable.shallow,
      filteredData: observable.shallow,
      queryFilters: computed,
      metadata: false,
    });

    this.rootStore = rootStore;

    when(
      () => !get(this.rootStore.auth0Context, "loading"),
      () => this.fetchData(this.queryFilters)
    );

    reaction(
      () => this.queryFilters,
      (queryString) => this.fetchData(queryString)
    );
  }

  get queryFilters() {
    return getQueryStringFromFilters(
      Object.fromEntries(toJS(this.rootStore.filters))
    );
  }

  *fetchData(queryString) {
    const endpoint = `${this.rootStore.currentTenantId}/newRevocations/${this.file}${queryString}`;
    try {
      this.isLoading = true;
      const responseData = yield callMetricsApi(
        endpoint,
        this.rootStore.getTokenSilently
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

  filterData({ data, metadata }) {
    const { filters } = this.rootStore;
    const dataFilter = matchesTopLevelFilters({ filters });
    return filterOptimizedDataFormat({
      apiData: data,
      metadata,
      filterFn: dataFilter,
    });
  }
}
