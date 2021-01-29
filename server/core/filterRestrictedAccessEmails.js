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

/**
 * Processes the supervision_location_restricted_access_emails.
 * Returns an object that contains the restricted district matching
 * userEmail param, or an empty object if none of the values match.
 */
function filterRestrictedAccessEmails(userEmail, file) {
  return (result) => {
    const restrictedEmails = result[file];

    return restrictedEmails
      ? {
          [file]: restrictedEmails.find((u) => {
            return (
              u.restricted_user_email.toLowerCase() === userEmail.toLowerCase()
            );
          }),
        }
      : {};
  };
}

exports.default = filterRestrictedAccessEmails;
