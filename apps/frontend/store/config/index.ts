import { StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import { PUBLIC_ENV } from "@/config/public.env.config";
import { CONFIG_STORE_KEY, ETheme } from "@/constants/theme.constanst";

import { ConfigState, ConfigStore } from "./config.types";

export const configCreator =
  (initState?: Partial<ConfigState>): StateCreator<ConfigStore> =>
  (set, _get, _store) => {
    const store: ConfigStore = {
      theme: ETheme.BLUE,
      isDarkMode: false,
      _hasHydrated: false,
      ...initState,
      setTheme: (theme: ETheme) => set({ theme }),
      setDarkMode: (isDarkMode: boolean) => set({ isDarkMode }),
      toggleDarkMode: () =>
        set((state: ConfigState) => ({ isDarkMode: !state.isDarkMode })),
      setHasHydrated: (_hasHydrated: boolean) => set({ _hasHydrated }),
    };

    return store;
  };

export const createConfigStore = (initState?: Partial<ConfigState>) =>
  createStore<ConfigStore>()(
    devtools(
      persist(configCreator(initState), {
        name: CONFIG_STORE_KEY,
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      }),
      {
        name: "ConfigStore",
        enabled: PUBLIC_ENV.IS_DEBUG,
      },
    ),
  );
