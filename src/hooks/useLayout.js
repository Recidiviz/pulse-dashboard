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

import { useAuth0 } from "../react-auth0-spa";
import { getUserStateCode } from "../utils/authentication/user";
import { hasSideBar } from "../utils/layout/filters";
import { isLanternState } from "../views/stateViews";

function checkIsLantern(user, isAuthenticated) {
  if (!isAuthenticated) {
    return false;
  }

  const stateCode = getUserStateCode(user);
  return isLanternState(stateCode);
}

function checkIsWide(user, isAuthenticated) {
  // This lets us retrieve the state code for the user only after we have authenticated
  if (!isAuthenticated) {
    return false;
  }

  const stateCode = getUserStateCode(user);
  const isWideTopBar = !hasSideBar(stateCode, isAuthenticated);

  return isWideTopBar;
}

function useTopBar() {
  const { user, isAuthenticated } = useAuth0();

  const isLantern = checkIsLantern(user, isAuthenticated);
  const isWide = checkIsWide(user, isAuthenticated);

  return { isLantern, isWide };
}

export default useTopBar;
