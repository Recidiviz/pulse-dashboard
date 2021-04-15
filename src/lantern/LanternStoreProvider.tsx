import React, { useContext } from "react";
import LanternStore from "./LanternStore";
import RootStore from "../RootStore";

const LanternContext = React.createContext<LanternStore | undefined>(undefined);
const lanternStore = new LanternStore(RootStore);

interface ProviderProps {
  children: React.ReactElement;
}

const LanternStoreProvider: React.FC<ProviderProps> = ({ children }) => {
  return (
    <LanternContext.Provider value={lanternStore}>
      {children}
    </LanternContext.Provider>
  );
};

export function useLanternStore(): LanternStore {
  const context = useContext(LanternContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a LanternStoreProvider");
  }
  return context;
}

export function useDataStore(): Partial<LanternStore> {
  const { dataStore } = useLanternStore();
  // @ts-ignore
  return dataStore;
}

export function useFiltersStore(): Partial<LanternStore> {
  const { filtersStore } = useLanternStore();
  return filtersStore;
}

export function useUserStore(): Partial<LanternStore> {
  const { userStore } = useLanternStore();
  return userStore;
}

export default LanternStoreProvider;
