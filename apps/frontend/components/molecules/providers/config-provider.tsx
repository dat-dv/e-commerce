"use client";

import { createContext, ReactNode, useState } from "react";
import { useStore } from "zustand";

import Loading from "@/components/atoms/loading";
import { createConfigStore } from "@/store/config";

export type ConfigStore = ReturnType<typeof createConfigStore>;
export const ConfigContext = createContext<ConfigStore | null>(null);

export interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider = ({ children }: ConfigProviderProps) => {
  const [store] = useState(() => createConfigStore());
  const hasHydrated = useStore(store, (s) => s._hasHydrated);
  const isLoadingTransition = useStore(store, (s) => s.isLoadingTransition);
  const showLoading = !hasHydrated || isLoadingTransition;

  return (
    <ConfigContext.Provider value={store}>
      {showLoading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center">
          <Loading />
        </div>
      )}
      {children}
    </ConfigContext.Provider>
  );
};
