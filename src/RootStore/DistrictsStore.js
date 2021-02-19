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

import { compareStrings } from "./utils";
import { callMetricsApi, parseResponseByFileFormat } from "../api/metrics";

export default class DistrictsStore {
  apiData = {};

  isLoading = true;

  isError = false;

  file = `supervision_location_ids_to_names`;

  rootStore;

  constructor({ rootStore }) {
    makeAutoObservable(this, {
      fetchDistricts: flow,
      filterOptions: computed,
      districts: computed,
    });

    this.rootStore = rootStore;

    const { userStore } = rootStore;

    autorun(() => {
      if (
        userStore &&
        !userStore.userIsLoading &&
        this.rootStore.currentTenantId
      ) {
        this.fetchDistricts({
          tenantId: this.rootStore.currentTenantId,
        });
      }
    });
  }

  *fetchDistricts({ tenantId }) {
    if (!this.rootStore.tenantStore.isLanternTenant) {
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
        scope.setContext("DistrictsStore.fetchData", {
          endpoint,
        });
      });
      this.isError = true;
      this.isLoading = false;
    }
  }

  get districtKeys() {
    const { tenants } = this.rootStore.tenantStore;
    return {
      valueKey: tenants.districtValueKey,
      labelKey: tenants.districtLabelKey,
    };
  }

  get districts() {
    return uniqBy(this.apiData.data, this.districtKeys.valueKey)
      .map((d) => d[this.districtKeys.valueKey])
      .sort();
  }

  get filterOptions() {
    if (!this.apiData.data) return [];
    return uniqBy(this.apiData.data, this.districtKeys.valueKey)
      .map((d) => ({
        value: d[this.districtKeys.valueKey],
        label: d[this.districtKeys.labelKey],
      }))
      .sort(compareStrings("value"));
  }
}
