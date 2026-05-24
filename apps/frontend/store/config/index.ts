import { StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import { PUBLIC_ENV } from "@/config/public.env.config";
import { CONFIG_STORE_KEY, ETheme } from "@/constants/theme.constanst";

import { getSubdomainByHostname } from "@/utils/sub-domain/get-client-sub-domain";
import { ConfigState, ConfigStore, ELanguage } from "./config.types";

export const configCreator =
  (initState?: Partial<ConfigState>): StateCreator<ConfigStore> =>
  (set) => {
    const turnOffTransition = () => {
      setTimeout(() => {
        set({ isLoadingTransition: false });
      }, 320);
    };
    const store: ConfigStore = {
      theme: ETheme.BLUE,
      isDarkMode:
        typeof window !== "undefined"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
          : false,
      _hasHydrated: false,
      isLoadingTransition: false,
      language: getSubdomainByHostname() || ELanguage.EN,
      ...initState,
      setTheme: (theme: ETheme) => {
        set({ theme, isLoadingTransition: true });
        turnOffTransition();
      },
      setDarkMode: (isDarkMode: boolean) => {
        set({ isDarkMode, isLoadingTransition: true });
        turnOffTransition();
      },
      toggleDarkMode: () => {
        set((state: ConfigState) => ({
          isDarkMode: !state.isDarkMode,
          isLoadingTransition: true,
        }));
        turnOffTransition();
      },
      setHasHydrated: (_hasHydrated: boolean) => set({ _hasHydrated }),
      setLanguage: (language: ELanguage) => set({ language }),
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
          if (state && !Object.values(ETheme).includes(state.theme)) {
            state.setTheme(ETheme.BLUE);
          }
          const urlLang = getSubdomainByHostname();
          if (
            urlLang &&
            Object.values(ELanguage).includes(urlLang as ELanguage)
          ) {
            state?.setLanguage(urlLang as ELanguage);
          }
        },
      }),
      {
        name: "ConfigStore",
        enabled: PUBLIC_ENV.IS_DEBUG,
      },
    ),
  );
