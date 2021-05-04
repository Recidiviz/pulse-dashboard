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
import createAuth0Client, {
  Auth0ClientOptions,
  User,
  GetTokenSilentlyOptions,
  Auth0Client,
} from "@auth0/auth0-spa-js";
import { makeAutoObservable, runInAction, action } from "mobx";
import qs from "qs";
import { METADATA_NAMESPACE } from "../constants";

import { ERROR_MESSAGES } from "../constants/errorMessages";
import type RootStore from ".";
import { TenantId, UserAppMetadata } from "./types";
import tenants from "../tenants";

function isDemoMode(): boolean {
  return process.env.REACT_APP_IS_DEMO === "true";
}

/**
 * Returns an artificial Auth0 id token for a fake/demo user.
 * You can uncomment code for testing different user metadata.
 */
function getDemoUser(): User {
  return {
    picture:
      "https://ui-avatars.com/api/?name=Demo+Jones&background=0D8ABC&color=fff&rounded=true",
    name: "Demo Jones",
    email: "notarealemail@recidiviz.org",
    // email: "thirteen@mo.gov",
    "https://dashboard.recidiviz.org/app_metadata": {
      state_code: "recidiviz",
      // state_code: 'us_mo',
    },
  };
}

type ConstructorProps = {
  authSettings?: Auth0ClientOptions;
  rootStore?: typeof RootStore;
};

/**
 * Reactive wrapper around Auth0 client.
 * Call `authorize` to retrieve credentials or start login flow.
 *
 * @example
 *
 * ```js
 * const store = new UserStore({ authSettings: { domain, client_id, redirect_uri } });
 * if (!store.isAuthorized) {
 *   await store.authorize();
 *   // this may trigger a redirect to the Auth0 login domain;
 *   // if we're still here and user has successfully logged in,
 *   // store.isAuthorized should now be true.
 * }
 * ```
 */
export default class UserStore {
  authError?: Error;

  readonly authSettings?: Auth0ClientOptions;

  auth0?: Auth0Client;

  isAuthorized: boolean;

  userIsLoading: boolean;

  user?: User;

  getToken?: (options?: GetTokenSilentlyOptions) => void;

  logout?: () => void;

  readonly rootStore?: typeof RootStore;

  constructor({ authSettings, rootStore }: ConstructorProps) {
    makeAutoObservable(this, {
      rootStore: false,
      authSettings: false,
      setAuthError: action.bound,
      userHasAccess: action.bound,
    });

    this.authSettings = authSettings;
    this.rootStore = rootStore;

    this.isAuthorized = false;
    this.userIsLoading = true;
  }

  /**
   * If user already has a valid Auth0 credential, this method will retrieve it
   * and update class properties accordingly. If not, user will be redirected
   * to the Auth0 login domain for fresh authentication.
   * Returns an Error if Auth0 configuration is not present.
   */
  async authorize(): Promise<void> {
    if (isDemoMode()) {
      this.isAuthorized = true;
      this.userIsLoading = false;
      this.user = getDemoUser();
      this.getToken = () => "";

      return;
    }
    if (!this.authSettings) {
      this.authError = new Error(ERROR_MESSAGES.auth0Configuration);
      return;
    }

    try {
      this.auth0 = await createAuth0Client(this.authSettings);
      const urlQuery = qs.parse(window.location.search, {
        ignoreQueryPrefix: true,
      });
      if (urlQuery.code && urlQuery.state) {
        const { appState } = await this.auth0.handleRedirectCallback();
        // auth0 params are single-use, must be removed from history or they can cause errors
        let replacementUrl;
        if (appState && appState.targetUrl) {
          replacementUrl = appState.targetUrl;
        } else {
          // strip away all query params just to be safe
          replacementUrl = `${window.location.origin}${window.location.pathname}`;
        }
        window.history.replaceState({}, document.title, replacementUrl);
      }
      if (await this.auth0.isAuthenticated()) {
        const user = await this.auth0.getUser();
        runInAction(() => {
          this.userIsLoading = false;
          if (user && user.email_verified) {
            this.user = user;
            this.getToken = (options?: GetTokenSilentlyOptions) =>
              this.auth0?.getTokenSilently(options);
            this.logout = (...p: any) => this.auth0?.logout(...p);
            this.isAuthorized = true;
          } else {
            this.isAuthorized = false;
          }
        });
      } else {
        this.auth0.loginWithRedirect({
          appState: { targetUrl: window.location.href },
        });
      }
    } catch (error) {
      this.authError = error;
    }
  }

  /**
   * Returns the Auth0 app_metadata for the given user id token.
   */
  get userAppMetadata(): UserAppMetadata | undefined {
    if (!this.user) return undefined;
    const appMetadataKey = `${METADATA_NAMESPACE}app_metadata`;
    const appMetadata = this.user[appMetadataKey];
    if (!appMetadata) {
      throw Error("No app_metadata available for user");
    }
    return appMetadata;
  }

  /**
   * Returns the state code of the authorized state for the given user.
   * For Recidiviz users or users in demo mode, this will be 'recidiviz'.
   */
  get stateCode(): TenantId {
    const stateCode = this.userAppMetadata?.state_code;
    if (!stateCode) {
      throw Error("No state code set for user");
    }
    return stateCode.toUpperCase() as TenantId;
  }

  /**
   * Returns the list of states which are accessible to users to view data for.
   */
  get availableStateCodes(): string[] {
    const stateCodes = tenants[this.stateCode].availableStateCodes;
    if (this.blockedStateCodes.length === 0) return stateCodes;
    return stateCodes.filter((sc) => !this.blockedStateCodes.includes(sc));
  }

  /**
   * Returns the human-readable state name for the authorized state code for
   * the given user.
   */
  get stateName(): string {
    return tenants[this.stateCode].name;
  }

  /**
   * Returns any blocked state codes for the authorized user.
   */
  get blockedStateCodes(): string[] {
    const blockedStateCodes = this.userAppMetadata?.blocked_state_codes;
    if (!blockedStateCodes) return [];
    return blockedStateCodes.map((sc) => sc.toUpperCase());
  }

  /**
   * Returns whether the user is authorized for specific state code.
   */
  userHasAccess(stateCode: TenantId): boolean {
    return this.availableStateCodes.includes(stateCode);
  }

  setAuthError(error: Error): void {
    this.authError = error;
  }

  async loginWithRedirect(): Promise<void> {
    return this.auth0?.loginWithRedirect({
      appState: { targetUrl: window.location.href },
    });
  }

  async getTokenSilently(): Promise<any> {
    if (!this.getToken || !this.logout) return;

    const token = (await this.getToken()) as any;
    if (token instanceof Error) {
      runInAction(() => {
        this.userIsLoading = true;
        this.isAuthorized = false;
      });
      await this.logout();
      await this.loginWithRedirect();
    }
    return this.getToken();
  }
}
