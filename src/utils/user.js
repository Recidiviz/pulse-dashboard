// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2019 Recidiviz, Inc.
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

const STATE_CODE_BY_DOMAIN = {
  'recidiviz.org': 'Recidiviz',
  'nd.gov': 'North Dakota',
};

function getUserStateCode(user) {
  const emailSplit = user.email.split('@');
  const domain = emailSplit[emailSplit.length - 1].toLowerCase();
  return STATE_CODE_BY_DOMAIN[domain];
}

export {
  getUserStateCode,
};
