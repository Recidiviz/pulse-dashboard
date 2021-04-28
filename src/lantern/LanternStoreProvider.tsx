import React, { useContext } from "react";
import LanternStore from "./LanternStore";
import { rootStore } from "../components/StoreProvider";
// import RootStore from "../RootStore";
import type UserStore from "../RootStore/UserStore";
import type FiltersStore from "./LanternStore/FiltersStore";
import type DataStore from "./LanternStore/DataStore/DataStore";

const LanternContext = React.createContext<LanternStore | undefined>(undefined);
// @ts-ignore
const lanternStore = new LanternStore(rootStore);

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
    throw new Error(
      "useLanternStore must be used within a LanternStoreProvider"
    );
  }
  return context;
}

export function useDataStore(): DataStore {
  const { dataStore } = useLanternStore();
  return dataStore;
}

export function useFiltersStore(): FiltersStore {
  const { filtersStore } = useLanternStore();
  return filtersStore;
}

export function useUserStore(): UserStore {
  const { userStore } = useLanternStore();
  return userStore;
}

export default LanternStoreProvider;
