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
  action,
  get,
} from "mobx";

import { useAuth0 } from "../../react-auth0-spa";
import { callMetricsApi } from "../../api/metrics/metricsClient";
import { processResponseData } from "./processDataUtils";
import { applyTopLevelFilters } from "../../components/charts/new_revocations/helpers";

export default class MatrixStore {
  rootStore;

  filtersStore;

  isLoading = true;

  isError = false;

  apiData = [];

  auth0Context = observable.map({ loading: true });

  file = `revocations_matrix_cells`;

  violationTypes;

  constructor({ rootStore }) {
    makeAutoObservable(this, {
      fetchData: flow,
      apiData: observable.shallow,
      setAuth0Context: action,
      filteredData: computed,
    });

    this.rootStore = rootStore;

    this.filtersStore = rootStore.filtersStore;

    this.setAuth0Context();

    when(
      () => !get(this.auth0Context, "loading"),
      () => {
        this.fetchData();
      }
    );
  }

  setAuth0Context() {
    const auth0Context = useAuth0();
    this.auth0Context.merge(auth0Context);
  }

  *fetchData() {
    const endpoint = `${this.rootStore.currentTenantId}/newRevocations/${this.file}`;
    try {
      const responseData = yield callMetricsApi(
        endpoint,
        get(this.auth0Context, "getTokenSilently")
      );
      this.apiData = processResponseData(responseData, this.file).data;
      this.isLoading = false;
    } catch (error) {
      console.error(error);
      this.isError = true;
      this.isLoading = false;
    }
  }

  get filteredData() {
    if (!this.apiData) return [];
    const { filters } = this.filtersStore;
    return applyTopLevelFilters({ filters })(this.apiData);
  }
}
