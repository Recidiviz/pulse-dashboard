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

/**
 * This mapping includes tenant-specific mappings to keys in the `supervision_location_ids_to_names` reference view that
 * are used to generate the district filter options and to filter the chart data.
 *
 * districtPrimaryIdKey: The key from reference table mapping used to create the district ID to label mapping
 *                       alongside the districtPrimaryLabelKey. When there are nested options in a district filter,
 *                       this key returns the parent value of a nested group.
 *
 * districtPrimaryLabelKey: The formatted label that maps to the districtPrimaryIdKey. This is the label used to display a parent
 *                          option in the district filter.
 *
 * districtSecondaryIdKey: The ID is used to create the district ID to label mapping with the districtSecondaryLabelKey.
 *                         When there are nested options in a district filter, this ID returns the nested option's value.
 *
 * districtSecondaryLabelKey: The formatted label that maps to the districtSecondaryIdKey. This is the label used to display
 *                            a nested option in the district filter.
 *
 * districtFilterByKey: The key that should be used in the data filters when filtering the metric files. The value from this key
 *                      must correspond to the value returned by the districtFilterValueKey.
 *
 * districtFilterKey: The primary filter to use in for the filters object. This is the key that will be used in the data filters.
 *
 * districtSecondaryFilterKey: The secondary filter ot use in the filters object. When present, the data filters will apply both
 *                             the districtFilterKey and the districtSecondaryFilterKey when filtering the metric data.
 *
 * districtFilterValueKey: The key from the reference table mapping to use for the district filter option's value.
 *                         This is the value that will be filtered on in the data filters using the districtFilterByKey
 *                         on the metric data.
 */
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
  districtSecondaryFilterKey: {
    [US_MO]: null,
    [US_PA]: "levelTwoSupervisionLocation",
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
