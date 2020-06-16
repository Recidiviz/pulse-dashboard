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
import { getCurrentStateCodeForAdminUsers } from "../views/stateViews";

const AdminStateCodeContext = createContext({});

export const useAdminStateCode = () => useContext(AdminStateCodeContext);

// eslint-disable-next-line react/prop-types
export const AdminStateCodeProvider = ({ children }) => {
  const { user } = useAuth0();
  const currentStateCode = getCurrentStateCodeForAdminUsers(user);

  const [adminStateCode, setAdminStateCode] = useState(currentStateCode);

  const contextValue = {
    adminStateCode,
    setAdminStateCode,
  };

  return (
    <AdminStateCodeContext.Provider value={contextValue}>
      {children}
    </AdminStateCodeContext.Provider>
  );
};
