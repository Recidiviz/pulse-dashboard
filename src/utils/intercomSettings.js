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

import { getUserStateCode } from "../utils/authentication/user"

const APP_ID = process.env.REACT_APP_INTERCOM_APP_ID;

export function initIntercomSettings() {
  window.intercomSettings = {
    app_id: APP_ID,
  };

  window.Intercom("boot", window.IntercomSettings);
}

export function enableIntercomLauncherForUser(user) {
  const userStateCode = getUserStateCode(user);
  const intercomSettings = {
    state_code: userStateCode,
    name: user.name,
    nickname: user.nickname,
    email: user.email,
    user_id: user.sub,
    hide_default_launcher: false
  }

  window.Intercom("update", intercomSettings)
}

export function disableIntercomLauncher() {
  window.Intercom("update", { hide_default_launcher: true} )
}