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

import { makeObservable, reaction, observable, action, computed } from "mobx";
import { matchesAllFilters } from "shared-filters";
import BaseDataStore from "./BaseDataStore";
import {
  DISTRICT,
  LEVEL_1_SUPERVISION_LOCATION,
  LEVEL_2_SUPERVISION_LOCATION,
} from "../../constants/filterTypes";

const CHARTS = {
  District: {
    name: "District",
    file: "revocations_matrix_distribution_by_district",
    skippedFilters: [
      DISTRICT,
      LEVEL_1_SUPERVISION_LOCATION,
      LEVEL_2_SUPERVISION_LOCATION,
    ],
  },
  "Risk level": {
    name: "Risk level",
    file: "revocations_matrix_distribution_by_risk_level",
  },
  Gender: {
    name: "Gender",
    file: "revocations_matrix_distribution_by_gender",
    statePopulationFile: "state_gender_population",
  },
  Officer: {
    name: "Officer",
    file: "revocations_matrix_distribution_by_officer",
  },
  Race: {
    name: "Race",
    file: "revocations_matrix_distribution_by_race",
    statePopulationFile: "state_race_ethnicity_population",
  },
  Violation: {
    name: "Violation",
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
      statePopulationFile: CHARTS[DEFAULT_SELECTED_CHART].statePopulationFile,
      skippedFilters: CHARTS[DEFAULT_SELECTED_CHART].skippedFilters,
    });
    makeObservable(this, {
      selectedChart: observable,
      setSelectedChart: action.bound,
      currentDistricts: computed,
      districtChartData: computed,
    });

    reaction(
      () => this.selectedChart,
      () => {
        super.file = CHARTS[this.selectedChart].file;
        this.fetchData({
          tenantId: this.rootStore.currentTenantId,
        });

        super.statePopulationFile =
          CHARTS[this.selectedChart].statePopulationFile;
        this.fetchStatePopulationData({
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
    const dataFilter = matchesAllFilters({
      filters: this.filters,
      skippedFilters: this.skippedFilters,
    });
    return this.filterData(this.apiData, dataFilter);
  }

  get districtChartData() {
    const { districtIdToLabel } = this.rootStore.districtsStore;
    const {
      districtKeys: { filterByKey },
    } = this.rootStore.filtersStore;

    return this.filteredData
      .filter((d) => d[filterByKey] !== "ALL")
      .map((data) => {
        return {
          ...data,
          districtPrimary: districtIdToLabel[data[filterByKey]],
        };
      });
  }

  get currentDistricts() {
    if (this.selectedChart !== CHARTS.District.name) return [];
    const { districtIdToLabel } = this.rootStore.districtsStore;
    const {
      districtKeys: { filterKey },
    } = this.rootStore.filtersStore;
    return this.filters[filterKey].map((district) => {
      if (district === "All") return district;
      return districtIdToLabel[district];
    });
  }
}
