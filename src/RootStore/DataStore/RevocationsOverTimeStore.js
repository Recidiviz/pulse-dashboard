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

import { flow, makeObservable } from "mobx";

import BaseDataStore from "./BaseDataStore";
import { callMetricsApi } from "../../api/metrics/metricsClient";
import { processResponseData } from "./helpers";
import { matchesAllFilters } from "../../components/charts/new_revocations/helpers";
import { METRIC_PERIOD_MONTHS } from "../../constants/filterTypes";
import { filterOptimizedDataFormat } from "../../utils/charts/dataFilters";

export default class RevocationsOverTimeStore extends BaseDataStore {
  constructor({ rootStore }) {
    super({
      rootStore,
      file: `revocations_matrix_by_month`,
      skippedFilters: [METRIC_PERIOD_MONTHS],
    });
    makeObservable(this, {
      fetchData: flow,
    });
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
      const processedData = processResponseData(
        responseData,
        this.file,
        this.eagerExpand
      );

      const expandedData = processResponseData(responseData, this.file, true);
      // TODO epic #593 - setDistricts based on supervision_location_ids_to_names.json
      // and remove this fetchData override
      this.rootStore.tenantStore.setDistricts(expandedData.data);
      this.apiData = processedData;
      this.isLoading = false;
      this.isError = false;
    } catch (error) {
      console.error(error);
      this.isError = true;
      this.isLoading = false;
    }
  }

  get filteredData() {
    if (!this.apiData.data) return [];
    const { data, metadata } = this.apiData;
    const { filters } = this.rootStore;

    const dataFilter = matchesAllFilters({
      filters,
      skippedFilters: this.skippedFilters,
    });

    return filterOptimizedDataFormat({
      apiData: [...data],
      metadata,
      filterFn: dataFilter,
    });
  }
}
