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

const CHART_TO_FILENAME = {
  District: "revocations_matrix_distribution_by_district",
  "Risk level": "revocations_matrix_distribution_by_risk_level",
  Gender: "revocations_matrix_distribution_by_gender",
  Officer: "revocations_matrix_distribution_by_officer",
  Race: "revocations_matrix_distribution_by_race",
  Violation: "revocations_matrix_distribution_by_violation",
};

const DEFAULT_SELECTED_CHART = "District";

export default class RevocationsChartStore extends BaseDataStore {
  selectedChart = DEFAULT_SELECTED_CHART;

  constructor({ rootStore }) {
    super({ rootStore, file: CHART_TO_FILENAME[DEFAULT_SELECTED_CHART] });
    makeObservable(this, {
      selectedChart: observable,
      setSelectedChart: action.bound,
    });

    reaction(
      () => this.selectedChart,
      () => {
        super.file = CHART_TO_FILENAME[this.selectedChart];
        this.fetchData(this.queryFilters);
      }
    );
  }

  setSelectedChart(chartId) {
    this.selectedChart = chartId;
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
