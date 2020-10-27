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

import PropTypes from "prop-types";
import React from "react";

const PageStateContext = React.createContext();
const PageDispatchContext = React.createContext();

function pageReducer(state, action) {
  switch (action.type) {
    case "update": {
      return { ...state, ...action.payload };
    }
    case "clear": {
      return {};
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export function PageProvider({ children }) {
  const [state, dispatch] = React.useReducer(pageReducer, {});
  return (
    <PageStateContext.Provider value={state}>
      <PageDispatchContext.Provider value={dispatch}>
        {children}
      </PageDispatchContext.Provider>
    </PageStateContext.Provider>
  );
}

PageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function usePageState() {
  const context = React.useContext(PageStateContext);
  if (context === undefined) {
    throw new Error("usePageState must be used within an PageProvider");
  }
  return context;
}

export function usePageDispatch() {
  const context = React.useContext(PageDispatchContext);
  if (context === undefined) {
    throw new Error("usePageDispatch must be used within an PageProvider");
  }
  return context;
}
