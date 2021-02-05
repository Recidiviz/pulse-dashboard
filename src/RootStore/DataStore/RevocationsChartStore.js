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

import { makeObservable, reaction, observable, action } from "mobx";
import BaseDataStore from "./BaseDataStore";
import { filterOptimizedDataFormat } from "../../utils/charts/dataFilters";
import { matchesAllFilters } from "../../components/charts/new_revocations/helpers";
import { DISTRICT } from "../../constants/filterTypes";

const CHARTS = {
  District: {
    file: "revocations_matrix_distribution_by_district",
    skippedFilters: [DISTRICT],
  },
  "Risk level": {
    file: "revocations_matrix_distribution_by_risk_level",
  },
  Gender: {
    file: "revocations_matrix_distribution_by_gender",
  },
  Officer: {
    file: "revocations_matrix_distribution_by_officer",
  },
  Race: {
    file: "revocations_matrix_distribution_by_race",
  },
  Violation: {
    file: "revocations_matrix_distribution_by_violation",
  },
};

const DEFAULT_SELECTED_CHART = "District";

export default class RevocationsChartStore extends BaseDataStore {
  selectedChart = DEFAULT_SELECTED_CHART;

  constructor({ rootStore }) {
    super({
      rootStore,
      file: CHARTS[DEFAULT_SELECTED_CHART].file,
      skippedFilters: CHARTS[DEFAULT_SELECTED_CHART].skippedFilters,
    });
    makeObservable(this, {
      selectedChart: observable,
      setSelectedChart: action.bound,
    });
    reaction(
      () => this.selectedChart,
      () => {
        super.file = CHARTS[this.selectedChart].file;
        this.fetchData({
          tenantId: this.rootStore.currentTenantId,
        });
      }
    );
  }

  setSelectedChart(chartId) {
    this.selectedChart = chartId;
    this.skippedFilters = CHARTS[chartId].skippedFilters || [];
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
