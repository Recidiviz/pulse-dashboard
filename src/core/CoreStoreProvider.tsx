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
import React, { useContext } from "react";
import CoreStore from "./CoreStore";
import FiltersStore from "./CoreStore/FiltersStore";
import RootStore from "../RootStore";

const CoreContext = React.createContext<CoreStore | undefined>(undefined);
const coreStore = new CoreStore(RootStore);

interface ProviderProps {
  children: React.ReactElement;
}

const CoreStoreProvider: React.FC<ProviderProps> = ({ children }) => {
  return (
    <CoreContext.Provider value={coreStore}>{children}</CoreContext.Provider>
  );
};

export function useCoreStore(): CoreStore {
  const context = useContext(CoreContext);
  if (context === undefined) {
    throw new Error("useCoreStore must be used within a CoreStoreProvider");
  }
  return context;
}

export function useFiltersStore(): FiltersStore {
  const { filtersStore } = useCoreStore();
  return filtersStore;
}

export default CoreStoreProvider;
