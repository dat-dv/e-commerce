"use client";

import { createContext, ReactNode, useState } from "react";
import { useStore } from "zustand";

import { Loading } from "@ecommerce/ui";
import { createConfigStore } from "@/store/config";
import { ConfigState } from "@/store/config/config.types";

export type ConfigStore = ReturnType<typeof createConfigStore>;
export const ConfigContext = createContext<ConfigStore | null>(null);

export interface ConfigProviderProps {
  children: ReactNode;
  initState?: Partial<ConfigState>;
}

export const ConfigProvider = ({
  children,
  initState,
}: ConfigProviderProps) => {
  const [store] = useState(() =>
    createConfigStore({ ...initState, _hasHydrated: true }),
  );
  const hasHydrated = useStore(store, (s) => s._hasHydrated);
  const isLoadingTransition = useStore(store, (s) => s.isLoadingTransition);
  const showLoading = !hasHydrated || isLoadingTransition;

  return (
    <ConfigContext.Provider value={store}>
      {showLoading && (
        <div className="fixed top-0 right-0 bottom-0 left-0 z-50 flex items-center justify-center">
          <Loading />
        </div>
      )}
      {children}
    </ConfigContext.Provider>
  );
};
