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
import * as Sentry from "@sentry/react";
import { makeAutoObservable } from "mobx";

import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { US_MO } from "../../RootStore/TenantStore/lanternTenants";
import { safeToInt } from "../../utils";
import type LanternStore from ".";
import { CHARTS } from "./DataStore/RevocationsChartStore";

const typeSafeIncludes = (arrayA: string[], arrayB: string[]): string[] => {
  return arrayA.filter((a: string) => {
    return arrayB.map((b: string) => safeToInt(b)).includes(safeToInt(a));
  });
};

type ConstructorProps = {
  rootStore: LanternStore;
};

export default class UserRestrictionsStore {
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
    return this.rootStore.tenantStore.enableUserRestrictions;
  }

  get allowedSupervisionLocationIds(): string[] {
    const normalizedIds = typeSafeIncludes(
      this.rootStore.districtsStore.districtIds,
      this.rootStore.userStore.allowedSupervisionLocationIds
    );

    return normalizedIds || [];
  }

  verifyUserRestrictions(): void {
    const verifiedLocations = typeSafeIncludes(
      this.rootStore.userStore.allowedSupervisionLocationIds,
      this.rootStore.districtsStore.districtIds
    );
    if (
      this.rootStore.userStore.allowedSupervisionLocationIds.length > 0 &&
      verifiedLocations.length === 0
    ) {
      const authError = new Error(ERROR_MESSAGES.unauthorized);
      Sentry.captureException(authError, {
        tags: {
          allowedSupervisionLocationIds: this.rootStore.userStore.allowedSupervisionLocationIds.join(
            ","
          ),
        },
      });
      this.rootStore.userStore.setAuthError(authError);
    }
  }
}
