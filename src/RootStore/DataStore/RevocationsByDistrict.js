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

import { flow, makeAutoObservable, when, observable, computed } from "mobx";
import { useAuth0 } from "../../react-auth0-spa";
import { callMetricsApi } from "../../api/metrics/metricsClient";
import { processResponseData } from "./processDataUtils";
import { applyAllFilters } from "../../components/charts/new_revocations/helpers";
import { DISTRICT } from "../../constants/filterTypes";

export default class RevocationsByDistrictStore {
  dataStore;

  filtersStore;

  isLoading = true;

  isError = false;

  apiData = observable.map({ data: [], metadata: {} });

  auth0Context;

  file = `revocations_matrix_distribution_by_district`;

  constructor({ dataStore, filtersStore }) {
    makeAutoObservable(this, {
      fetchData: flow,
      filteredData: computed,
    });

    this.dataStore = dataStore;

    this.filtersStore = filtersStore;

    this.auth0Context = useAuth0();

    when(
      () => !this.auth0Context.loading,
      () => this.fetchData()
    );
  }

  get filteredData() {
    if (!this.apiData.data) return [];
    const { filters } = this.filtersStore;
    return applyAllFilters({ filters, skippedFilters: [DISTRICT] })(
      this.apiData.data
    );
  }

  *fetchData() {
    const endpoint = `${this.dataStore.currentTenantId}/newRevocations/${this.file}`;
    try {
      const responseData = yield callMetricsApi(
        endpoint,
        this.auth0Context.getTokenSilently
      );
      this.apiData = processResponseData(responseData, this.file);
      this.isLoading = false;
    } catch (error) {
      console.error(error);
      this.isError = true;
      this.isLoading = false;
    }
  }
}
