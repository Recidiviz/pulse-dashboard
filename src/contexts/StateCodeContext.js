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

import React, { createContext, useState, useContext } from "react";

import { useAuth0 } from "../react-auth0-spa";
import {
  getAvailableStateCodes,
  doesUserHaveAccess,
} from "../utils/authentication/user";

const CURRENT_STATE_IN_SESSION = "adminUserCurrentStateInSession";

const StateCodeContext = createContext({});

export const useStateCode = () => useContext(StateCodeContext);

// eslint-disable-next-line react/prop-types
export const StateCodeProvider = ({ children }) => {
  const { user } = useAuth0();

  const [currentStateCode, setCurrentStateCode] = useState(
    // eslint-disable-next-line no-use-before-define
    getCurrentStateCode()
  );

  /*
   * Returns the current state that should be viewed. This is retrieved from
   * the sessionStorage cache if already set. Otherwise, picks the first available state in ABC order.
   */
  function getCurrentStateCode() {
    const fromStorage = sessionStorage.getItem(CURRENT_STATE_IN_SESSION);
    if (user) {
      const availableStateCodes = getAvailableStateCodes(user);
      if (fromStorage && doesUserHaveAccess(user, fromStorage)) {
        return fromStorage;
      }
      return availableStateCodes[0];
    }
    return fromStorage;
  }

  /**
   * For admin users, sets the current state that should be viewed in the sessionStorage cache.
   */
  function updateCurrentStateCode(stateCode) {
    setCurrentStateCode(stateCode);
    sessionStorage.setItem(CURRENT_STATE_IN_SESSION, stateCode);
  }

  /**
   * Update user state code after user loading
   */
  function refreshCurrentStateCode() {
    updateCurrentStateCode(getCurrentStateCode());
  }

  const contextValue = {
    currentStateCode,
    updateCurrentStateCode,
    getAvailableStateCodes,
    refreshCurrentStateCode,
  };

  return (
    <StateCodeContext.Provider value={contextValue}>
      {children}
    </StateCodeContext.Provider>
  );
};
