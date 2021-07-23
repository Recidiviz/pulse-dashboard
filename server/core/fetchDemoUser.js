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

/**
 * Returns an artificial Auth0 id token for a fake/demo user.
 * You can pass in other attributes to override the defaults.
 */
function fetchDemoUser({
  email = "notarealemail@recidiviz.org",
  name = "Demo Jones",
  stateCode = "recidiviz",
  allowedSupervisionLocationIds,
  allowedSupervisionLocationLevel,
}) {
  return {
    picture:
      "https://ui-avatars.com/api/?name=Demo+Jones&background=0D8ABC&color=fff&rounded=true",
    name,
    email,
    [`${process.env.METADATA_NAMESPACE}app_metadata`]: {
      state_code: stateCode,
      allowed_supervision_location_ids: allowedSupervisionLocationIds,
      allowed_supervision_location_level: allowedSupervisionLocationLevel,
      can_access_leadership_dashboard: true,
      can_acceess_case_triage: true,
    },
  };
}

module.exports = { fetchDemoUser };
