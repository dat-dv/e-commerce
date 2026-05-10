'use client';

import { createContext, ReactNode, useState } from 'react';
import { useStore } from 'zustand';

import Loading from '@/components/atoms/loading';
import { createConfigStore } from '@/store/config';

export type ConfigStore = ReturnType<typeof createConfigStore>;
export const ConfigContext = createContext<ConfigStore | null>(null);

export interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider = ({ children }: ConfigProviderProps) => {
  const [store] = useState(() => createConfigStore());
  const hasHydrated = useStore(store, (s) => s._hasHydrated);

  if (!hasHydrated) {
    return <Loading />;
  }

  return <ConfigContext.Provider value={store}>{children}</ConfigContext.Provider>;
};
