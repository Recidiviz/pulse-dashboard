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
import { flow, autorun, makeAutoObservable, computed } from "mobx";
import uniqBy from "lodash/uniqBy";
import * as Sentry from "@sentry/react";
import { callMetricsApi, parseResponseByFileFormat } from "../api/metrics";
import { translate } from "../views/tenants/utils/i18nSettings";

export default class SupervisionLocationsStore {
  apiData = {};

  isLoading = true;

  isError = false;

  file = `supervision_location_ids_to_names`;

  rootStore;

  constructor({ rootStore }) {
    makeAutoObservable(this, {
      fetchSupervisionLocations: flow,
      filterOptions: computed,
      supervisionLocations: computed,
    });

    this.rootStore = rootStore;

    const { userStore } = rootStore;

    autorun(() => {
      if (
        userStore &&
        !userStore.userIsLoading &&
        this.rootStore.currentTenantId
      ) {
        this.fetchSupervisionLocations({
          tenantId: this.rootStore.currentTenantId,
        });
      }
    });
  }

  *fetchSupervisionLocations({ tenantId }) {
    if (!this.rootStore?.tenantStore.isLanternTenant) {
      this.isLoading = false;
      this.isError = false;
      return;
    }
    const endpoint = `${tenantId}/newRevocations/${this.file}`;
    try {
      this.isLoading = true;
      const responseData = yield callMetricsApi(
        endpoint,
        this.rootStore.getTokenSilently
      );
      this.apiData = parseResponseByFileFormat(
        responseData,
        this.file,
        this.eagerExpand
      );
      this.isLoading = false;
      this.isError = false;
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, (scope) => {
        scope.setContext("SupervisionLocationsStore.fetchData", {
          endpoint,
        });
      });
      this.isError = true;
      this.isLoading = false;
    }
  }

  get supervisionLocations() {
    const valueKey = translate("supervisionLocationValueKey");
    return this.apiData.data.map((d) => d[valueKey]);
  }

  get filterOptions() {
    if (!this.apiData.data) return [];
    const valueKey = translate("supervisionLocationValueKey");
    const labelKey = translate("supervisionLocationLabelKey");

    return uniqBy(this.apiData.data, valueKey).map((d) => ({
      value: d[valueKey],
      label: d[labelKey],
    }));
  }
}
