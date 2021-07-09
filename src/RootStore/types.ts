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
/* eslint camelcase: 0 */
import { LANTERN, RECIDIVIZ_TENANT } from "../tenants";
import * as core from "./TenantStore/coreTenants";
import * as lantern from "./TenantStore/lanternTenants";

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
  state_code: Lowercase<TenantId>;
  blocked_state_codes?: Lowercase<TenantId>[];
  allowed_supervision_location_ids?: string[];
  allowed_supervision_location_level?: string;
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
