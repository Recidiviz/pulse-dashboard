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
  reaction,
  observable,
  computed,
  action,
  get,
  toJS,
} from "mobx";
import { callMetricsApi } from "../../api/metrics/metricsClient";
import { processResponseData } from "./helpers";
import { filterOptimizedDataFormat } from "../../utils/charts/dataFilters";
import { matchesAllFilters } from "../../components/charts/new_revocations/helpers";
import { DISTRICT } from "../../constants/filterTypes";
import { getQueryStringFromFilters } from "../../api/metrics/urlHelpers";

const CHART_TO_FILENAME = {
  District: "revocations_matrix_distribution_by_district",
  "Risk level": "revocations_matrix_distribution_by_risk_level",
  Gender: "revocations_matrix_distribution_by_gender",
  Officer: "revocations_matrix_distribution_by_officer",
  Race: "revocations_matrix_distribution_by_race",
  Violation: "revocations_matrix_distribution_by_violation",
};

export default class RevocationsChartsStore {
  rootStore;

  isLoading = true;

  isError = false;

  apiData = [];

  filteredData = [];

  metadata = {};

  selectedChart = "District";

  eagerExpand = false;

  auth0Context = observable.map({ loading: true });

  constructor({ rootStore }) {
    makeAutoObservable(this, {
      fetchData: flow,
      apiData: observable.shallow,
      filteredData: observable.shallow,
      selectedChart: observable,
      setSelectedChart: action.bound,
      queryFilters: computed,
      metadata: false,
    });

    this.rootStore = rootStore;

    when(
      () => !get(this.rootStore.auth0Context, "loading"),
      () => this.fetchData(getQueryStringFromFilters(this.queryFilters))
    );

    reaction(
      () => this.selectedChart,
      () => this.fetchData(getQueryStringFromFilters(this.queryFilters))
    );

    reaction(
      () => getQueryStringFromFilters(this.queryFilters),
      (queryString) => this.fetchData(queryString, false)
    );
  }

  get queryFilters() {
    return Object.fromEntries(toJS(this.rootStore.filters));
  }

  setSelectedChart(chartId) {
    this.selectedChart = chartId;
  }

  *fetchData(queryString, isLoading = true) {
    const filename = CHART_TO_FILENAME[this.selectedChart];
    const endpoint = `${this.rootStore.currentTenantId}/newRevocations/${filename}${queryString}`;
    try {
      this.isLoading = isLoading;
      const responseData = yield callMetricsApi(
        endpoint,
        this.rootStore.getTokenSilently
      );
      const processedData = processResponseData(
        responseData,
        filename,
        this.eagerExpand
      );
      this.apiData = processedData.data;
      this.metadata = processedData.metadata;
      this.filteredData = this.filterData(processedData);
      this.isLoading = false;
    } catch (error) {
      console.error(error);
      this.isError = true;
      this.isLoading = false;
    }
  }

  filterData({ data, metadata }) {
    const { filters } = this.rootStore;
    const filteringOptions = {
      District: { skippedFilters: [DISTRICT] },
    };
    const dataFilter = matchesAllFilters({
      filters,
      ...filteringOptions[this.selectedChart],
    });
    return filterOptimizedDataFormat({
      apiData: data,
      metadata,
      filterFn: dataFilter,
    });
  }
}
