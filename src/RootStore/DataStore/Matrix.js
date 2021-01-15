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

  metadata = {};

  auth0Context = observable.map({ loading: true });

  file = `revocations_matrix_cells`;

  eagerExpand = false;

  constructor({ rootStore }) {
    makeAutoObservable(this, {
      fetchData: flow,
      apiData: observable.shallow,
      filteredData: computed,
      queryFilters: computed,
      metadata: false,
    });

    this.rootStore = rootStore;

    when(
      () => !get(this.rootStore.auth0Context, "loading"),
      () => this.fetchData(getQueryStringFromFilters(this.queryFilters))
    );

    reaction(
      () => getQueryStringFromFilters(this.queryFilters),
      (queryString) => this.fetchData(queryString)
    );
  }

  get queryFilters() {
    return Object.fromEntries(toJS(this.rootStore.filters));
  }

  *fetchData(queryString) {
    const endpoint = `${this.rootStore.currentTenantId}/newRevocations/${this.file}${queryString}`;
    try {
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
      this.isLoading = false;
    } catch (error) {
      console.error(error);
      this.isError = true;
      this.isLoading = false;
    }
  }

  get filteredData() {
    if (!this.apiData) return [];
    const { filters } = this.rootStore;
    const dataFilter = matchesTopLevelFilters({ filters });
    return filterOptimizedDataFormat({
      apiData: this.apiData.slice(),
      metadata: this.metadata,
      filterFn: dataFilter,
    });
  }
}
