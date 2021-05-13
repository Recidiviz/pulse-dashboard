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
import { makeAutoObservable } from "mobx";
import * as Sentry from "@sentry/react";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import type LanternStore from ".";
import { US_MO } from "../../RootStore/TenantStore/lanternTenants";
import { CHARTS } from "./DataStore/RevocationsChartStore";

type ConstructorProps = {
  rootStore: LanternStore;
};

export default class UserRestrictedAccessStore {
  readonly rootStore: LanternStore;

  constructor({ rootStore }: ConstructorProps) {
    makeAutoObservable(this, {
      rootStore: false,
    });

    this.rootStore = rootStore;
  }

  get enabledRevocationsCharts(): string[] {
    if (this.hasUserRestrictions && this.rootStore.currentTenantId === US_MO) {
      return Object.keys(CHARTS).filter(
        (chartId) => !["Race", "Gender"].includes(chartId)
      );
    }
    return Object.keys(CHARTS);
  }

  get hasUserRestrictions(): boolean {
    return (
      this.rootStore.userRestrictions &&
      this.rootStore.userRestrictions.length > 0 &&
      this.rootStore.tenantStore.isRestrictedDistrictTenant
    );
  }

  get allowedSupervisionLocationIds(): string[] {
    if (!this.rootStore.tenantStore.isRestrictedDistrictTenant) return [];
    return this.rootStore.userRestrictions;
  }

  verifyUserRestrictions(): void {
    if (!this.rootStore.tenantStore.isRestrictedDistrictTenant) return;
    const unverifiedLocations = this.rootStore.userRestrictions.filter(
      (supervisionLocationId) => {
        return !this.rootStore.districtsStore.districtIds.includes(
          supervisionLocationId
        );
      }
    );

    if (
      this.rootStore.userRestrictions.length > 0 &&
      unverifiedLocations.length > 0
    ) {
      const authError = new Error(ERROR_MESSAGES.unauthorized);
      Sentry.captureException(authError, {
        tags: {
          allowedSupervisionLocationIds: this.rootStore.userRestrictions.join(
            ","
          ),
        },
      });
      this.rootStore.userStore.setAuthError(authError);
    }
  }
}
