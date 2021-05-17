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

function updateAppMetadata(user, context, callback) {
  user.app_metadata = user.app_metadata || {};

  const emailSplit = user.email.split("@");
  const domain = emailSplit[emailSplit.length - 1].toLowerCase();

  // For testing different state codes
  if (user.email === "test-control@recidiviz.org") {
    callback(null, user, context);
  }

  // For CSG/Lantern users
  if (domain === "csg.org") {
    user.app_metadata.state_code = "lantern";
  }

  // For Recidiviz users
  // Do not update recidiviz_tester's state_code
  if (
    domain === "recidiviz.org" &&
    !user.app_metadata.recidiviz_tester
  ) {
    user.app_metadata.state_code = "recidiviz";
  }

  // Specific state code restrictions for Recividiz users
  if (user.email === "justine@recidiviz.org") {
    user.app_metadata.blocked_state_codes = ["us_pa"];
  }

  // persist the app_metadata update
  auth0.users
    .updateAppMetadata(user.user_id, user.app_metadata)
    .then(function () {
      callback(null, user, context);
    })
    .catch(function (err) {
      callback(err);
    });
}
