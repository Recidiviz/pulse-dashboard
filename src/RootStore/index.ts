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
import { computed, makeObservable } from "mobx";
import { Auth0ClientOptions, User } from "@auth0/auth0-spa-js";
import TenantStore from "./TenantStore";
import UserStore from "./UserStore";
import devAuthConfig from "../auth_config_dev.json";
import productionAuthConfig from "../auth_config_production.json";
import { TenantId } from "./types";

/**
 * Returns the auth settings configured for the current environment, if any.
 */
export function getAuthSettings(): Auth0ClientOptions {
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

class RootStore {
  tenantStore: TenantStore;

  userStore: UserStore;

  constructor() {
    makeObservable(this, {
      currentTenantId: computed,
      user: computed,
    });

    this.userStore = new UserStore({
      authSettings: getAuthSettings(),
      rootStore: this,
    });

    this.tenantStore = new TenantStore({ rootStore: this });
  }

  get currentTenantId(): TenantId | undefined {
    return this.tenantStore.currentTenantId;
  }

  get user(): User | undefined {
    return this.userStore.user;
  }

  get availableStateCodes(): string[] {
    return this.userStore.availableStateCodes;
  }

  get getTokenSilently() {
    return this.userStore.getTokenSilently;
  }
}

export default new RootStore();
