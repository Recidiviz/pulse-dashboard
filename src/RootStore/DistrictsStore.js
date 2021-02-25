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

export default class DistrictsStore {
  apiData = {};

  isLoading = true;

  isError = false;

  file = `supervision_location_ids_to_names`;

  filteredDistricts = [];

  rootStore;

  constructor({ rootStore }) {
    makeAutoObservable(this, {
      fetchDistricts: flow,
      districtIds: computed,
      districtKeys: computed,
      districtIdToLabel: computed,
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
        this.rootStore.userStore.getTokenSilently
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
    const { tenantMappings } = this.rootStore.tenantStore;
    return {
      valueKey: tenantMappings.districtFilterValueKey,
      filterKey: tenantMappings.districtFilterKey,
      filterByKey: tenantMappings.districtFilterByKey,
      filterValueKey: tenantMappings.districtFilterValueKey,
      primaryIdKey: tenantMappings.districtPrimaryIdKey,
      primaryLabelKey: tenantMappings.districtPrimaryLabelKey,
      secondaryIdKey: tenantMappings.districtSecondaryIdKey,
      secondaryLabelKey: tenantMappings.districtSecondaryLabelKey,
    };
  }

  get districtIds() {
    const { primaryIdKey } = this.districtKeys;
    return uniqBy(this.apiData.data, primaryIdKey)
      .map((d) => d[primaryIdKey])
      .sort();
  }

  get districtIdToLabel() {
    if (!this.apiData.data) return {};
    const districtIdToLabel = {};
    const {
      primaryIdKey,
      secondaryIdKey,
      primaryLabelKey,
      secondaryLabelKey,
    } = this.districtKeys;

    this.apiData.data.forEach((d) => {
      districtIdToLabel[d[primaryIdKey]] = d[primaryLabelKey];
      if (secondaryLabelKey) {
        districtIdToLabel[d[secondaryIdKey]] = d[secondaryLabelKey];
      }
    });

    return {
      ...districtIdToLabel,
      ALL: "ALL",
      all: "ALL",
    };
  }

  // TODO #798: Remove the filtered districts when backend has the filtered supervision locations
  setFilteredDistricts(apiData) {
    if (apiData && this.apiData.data) {
      const { filterByKey, filterValueKey } = this.districtKeys;
      const data = apiData.slice();

      const validDistricts = data.map((d) => d[filterByKey]);

      this.filteredDistricts = this.apiData.data.filter((d) =>
        validDistricts.includes(d[filterValueKey])
      );
      this.isLoading = false;
    }
  }
}
