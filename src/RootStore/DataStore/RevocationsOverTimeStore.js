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
import { matchesAllFilters, filterOptimizedDataFormat } from "shared-filters";
import BaseDataStore from "./BaseDataStore";
import { callMetricsApi, parseResponseByFileFormat } from "../../api/metrics";
import { METRIC_PERIOD_MONTHS } from "../../constants/filterTypes";

export default class RevocationsOverTimeStore extends BaseDataStore {
  expandedData = [];

  constructor({ rootStore }) {
    super({ rootStore, file: `revocations_matrix_by_month` });
    makeObservable(this, {
      fetchData: flow,
    });
  }

  *fetchData({ tenantId, queryString = "" }) {
    const endpoint = `${tenantId}/newRevocations/${this.file}${queryString}`;
    try {
      this.isLoading = true;
      const responseData = yield callMetricsApi(
        endpoint,
        this.getTokenSilently
      );
      const processedData = parseResponseByFileFormat(
        responseData,
        this.file,
        this.eagerExpand
      );

      const expandedData = parseResponseByFileFormat(
        responseData,
        this.file,
        true
      );
      // TODO epic #593 - setDistricts based on supervision_location_ids_to_names.json
      // and remove this fetchData override
      this.rootStore.tenantStore.setDistricts(expandedData.data);
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
    const dataFilter = matchesAllFilters({
      filters: this.filters,
      skippedFilters: [METRIC_PERIOD_MONTHS],
    });

    if (this.eagerExpand || !Array.isArray(data[0])) {
      return data.filter((item) => dataFilter(item));
    }
    return filterOptimizedDataFormat(data, metadata, dataFilter);
  }
}
