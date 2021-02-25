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

import { US_MO, US_PA } from "./lanternTenants";

export const tenantMappings = {
  districtPrimaryIdKey: {
    [US_MO]: "level_1_supervision_location_external_id",
    [US_PA]: "level_2_supervision_location_external_id",
  },
  districtPrimaryLabelKey: {
    [US_MO]: "level_1_supervision_location_external_id",
    [US_PA]: "level_2_supervision_location_name",
  },
  districtSecondaryIdKey: {
    [US_MO]: "level_2_supervision_location_external_id",
    [US_PA]: "level_1_supervision_location_external_id",
  },
  districtSecondaryLabelKey: {
    [US_MO]: null,
    [US_PA]: "level_1_supervision_location_name",
  },
  districtFilterByKey: {
    [US_MO]: "level_1_supervision_location",
    [US_PA]: "level_1_supervision_location",
  },
  districtFilterKey: {
    [US_MO]: "levelOneSupervisionLocation",
    [US_PA]: "levelOneSupervisionLocation",
  },
  districtFilterValueKey: {
    [US_MO]: "level_1_supervision_location_external_id",
    [US_PA]: "level_1_supervision_location_external_id",
  },
};

export default function getTenantMappings(tenantId) {
  const tenant = {};
  Object.keys(tenantMappings).forEach((key) => {
    tenant[key] = tenantMappings[key][tenantId];
  });
  return tenant;
}
