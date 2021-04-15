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
    throw new Error("useStore must be used within a CoreStoreProvider");
  }
  return context;
}

export function useFiltersStore(): FiltersStore {
  const { filtersStore } = useCoreStore();
  return filtersStore;
}

export default CoreStoreProvider;
