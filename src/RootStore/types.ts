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
import * as lantern from "./TenantStore/lanternTenants";
import * as core from "./TenantStore/coreTenants";
import { RECIDIVIZ_TENANT, LANTERN } from "../tenants";

export type LanternTenants = typeof lantern.LANTERN_TENANTS[number];

const TenantIds = [
  lantern.US_MO,
  lantern.US_PA,
  core.US_ID,
  core.US_ND,
  RECIDIVIZ_TENANT,
  LANTERN,
] as const;

export type TenantId = typeof TenantIds[number];

export type UserAppMetadata = {
  // eslint-disable-next-line camelcase
  state_code: Lowercase<TenantId>;
};

export type LanternMethodologyByTenant = {
  [key in LanternTenants]: LanternMethodology;
};

export type LanternMethodology = {
  [k: string]: {
    id: number;
    header?: string;
    body: string;
  }[];
};
