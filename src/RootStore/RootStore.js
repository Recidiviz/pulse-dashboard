// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
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

import { computed, makeObservable } from "mobx";

import FiltersStore from "./FiltersStore";
import TenantStore from "./TenantStore";
import DataStore from "./DataStore/DataStore";
import UserStore from "./UserStore";
import devAuthConfig from "../auth_config_dev.json";
import productionAuthConfig from "../auth_config_production.json";
import DistrictsStore from "./DistrictsStore";

/**
 * Returns the auth settings configured for the current environment, if any.
 */
export function getAuthSettings() {
  const authEnv = process.env.REACT_APP_AUTH_ENV;
  let config = null;
  if (authEnv === "production") {
    config = productionAuthConfig;
  } else {
    config = devAuthConfig;
  }
  return {
    client_id: config.clientId,
    domain: config.domain,
    audience: config.audience,
    redirect_uri: `${window.location.origin}`,
  };
}

export default class RootStore {
  filtersStore;

  tenantStore;

  dataStore;

  userStore;

  districtsStore;

  constructor() {
    makeObservable(this, {
      filters: computed,
      currentTenantId: computed,
      user: computed,
    });

    this.userStore = new UserStore({
      authSettings: getAuthSettings(),
      rootStore: this,
    });

    this.tenantStore = new TenantStore({ rootStore: this });
    this.districtsStore = new DistrictsStore({
      rootStore: this,
    });
    this.filtersStore = new FiltersStore({ rootStore: this });
    this.dataStore = new DataStore({ rootStore: this });
  }

  get filters() {
    return this.filtersStore.filters;
  }

  get currentTenantId() {
    return this.tenantStore.currentTenantId;
  }

  get user() {
    return this.userStore.user;
  }

  get restrictedDistrict() {
    return this.userStore.restrictedDistrict;
  }
}
