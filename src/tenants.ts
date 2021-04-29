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
import * as lantern from "./RootStore/TenantStore/lanternTenants";
import * as core from "./RootStore/TenantStore/coreTenants";
import flags from "./flags";
import { TenantId } from "./RootStore/types";

export const RECIDIVIZ_TENANT = "RECIDIVIZ";
export const LANTERN = "LANTERN";

export type Navigation = {
  goals?: string[];
  community?: string[];
  facilities?: string[];
  methodology?: string[];
};

type Tenants = {
  [key in TenantId]: {
    name: string;
    stateCode: string;
    availableStateCodes: string[];
    navigation?: Navigation;
  };
};

const TENANTS: Tenants = {
  [lantern.US_MO]: {
    name: "Missouri",
    stateCode: "MO",
    availableStateCodes: [lantern.US_MO],
  },
  [core.US_ND]: {
    name: "North Dakota",
    stateCode: "ND",
    availableStateCodes: [core.US_ND],
    navigation: {
      goals: [],
      ...(flags.enableVitalsDashboard
        ? { community: ["explore", "vitals"] }
        : { community: ["explore"] }),
      facilities: ["explore"],
      ...(flags.showMethodologyDropdown ? { methodology: ["vitals"] } : {}),
    },
  },
  [core.US_ID]: {
    name: "Idaho",
    stateCode: "ID",
    availableStateCodes: [core.US_ID],
    navigation: {
      ...(flags.enableProjectionsDashboard
        ? { community: ["projections"] }
        : { community: [] }),
      ...(flags.enableProjectionsDashboard
        ? { facilities: ["projections"] }
        : { facilities: [] }),
      ...(flags.showMethodologyDropdown
        ? { methodology: ["projections"] }
        : {}),
    },
  },
  [lantern.US_PA]: {
    name: "Pennsylvania",
    stateCode: "PA",
    availableStateCodes: [lantern.US_PA],
  },
  RECIDIVIZ: {
    name: "Recidiviz",
    stateCode: "Recidiviz",
    availableStateCodes: lantern.LANTERN_TENANTS.concat(core.CORE_TENANTS),
  },
  LANTERN: {
    name: "Lantern",
    stateCode: "Lantern",
    availableStateCodes: lantern.LANTERN_TENANTS,
  },
};

export default TENANTS;
