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

/* eslint-disable camelcase */
import { makeAutoObservable, autorun, flow } from "mobx";
import * as Sentry from "@sentry/react";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import type RootStore from "./RootStore";
import { callRestrictedAccessApi } from "../api/metrics/metricsClient";

type ConstructorProps = {
  rootStore?: RootStore;
};

type RestrictedAccessEmail = {
  restricted_user_email: string;
  allowed_level_1_supervision_location_ids: string;
};

export default class UserRestrictedAccessStore {
  isLoading = true;

  isError = false;

  restrictedDistrict?: string;

  readonly rootStore?: RootStore;

  constructor({ rootStore }: ConstructorProps) {
    makeAutoObservable(this, {
      rootStore: false,
    });

    this.rootStore = rootStore;

    autorun(() => {
      if (
        !this.rootStore?.userStore.userIsLoading &&
        !this.rootStore?.districtsStore.isLoading &&
        this.rootStore?.currentTenantId
      ) {
        this.fetchRestrictedDistrictData(this.rootStore?.currentTenantId);
      }
    });
  }

  fetchRestrictedDistrictData = flow(function* (
    this: UserRestrictedAccessStore,
    tenantId: string
  ) {
    if (!this.rootStore?.tenantStore.isRestrictedDistrictTenant) {
      this.isLoading = false;
      return;
    }
    const file = "supervision_location_restricted_access_emails";
    const endpoint = `${tenantId}/restrictedAccess`;
    try {
      this.restrictedDistrict = undefined;
      const responseData = yield callRestrictedAccessApi(
        endpoint,
        this.rootStore.userStore.user.email,
        this.rootStore.userStore.getTokenSilently
      );
      this.setRestrictedDistrict(responseData[file]);
      this.isLoading = false;
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          tenantId,
          endpoint,
          availableStateCodes: this.rootStore.userStore.availableStateCodes.join(
            ","
          ),
        },
      });
      this.rootStore.userStore.setAuthError(
        new Error(ERROR_MESSAGES.unauthorized)
      );
      this.isError = true;
      this.isLoading = false;
    }
  });

  setRestrictedDistrict(restrictedEmail: RestrictedAccessEmail): void {
    this.restrictedDistrict =
      restrictedEmail &&
      restrictedEmail.allowed_level_1_supervision_location_ids;
    this.verifyRestrictedDistrict();
  }

  resetRestrictedDistrict(): void {
    this.isLoading = true;
    this.restrictedDistrict = undefined;
  }

  verifyRestrictedDistrict(): void {
    if (
      this.rootStore &&
      this.restrictedDistrict &&
      !this.rootStore.districtsStore.districtIds.includes(
        this.restrictedDistrict
      )
    ) {
      const authError = new Error(ERROR_MESSAGES.unauthorized);
      Sentry.captureException(authError, {
        tags: {
          restrictedDistrict: this.restrictedDistrict,
        },
      });
      this.rootStore.userStore.setAuthError(authError);
      this.isError = true;
      this.isLoading = false;
      this.restrictedDistrict = undefined;
    }
  }
}
