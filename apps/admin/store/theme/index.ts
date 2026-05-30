import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { ADMIN_THEME_KEY, EAdminTheme, VALID_THEMES } from "@/config/theme";

interface IAdminThemeState {
  theme: EAdminTheme;
  isDarkMode: boolean;
}

interface IAdminThemeActions {
  setTheme: (theme: EAdminTheme) => void;
  setDarkMode: (isDark: boolean) => void;
  toggleDarkMode: () => void;
}

export type TAdminThemeStore = IAdminThemeState & IAdminThemeActions;

export const useAdminThemeStore = create<TAdminThemeStore>()(
  devtools(
    persist(
      (set) => ({
        theme: EAdminTheme.INDIGO,
        isDarkMode:
          typeof window !== "undefined"
            ? window.matchMedia("(prefers-color-scheme: dark)").matches
            : true,

        setTheme: (theme) => set({ theme }),
        setDarkMode: (isDarkMode) => set({ isDarkMode }),
        toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
      }),
      {
        name: ADMIN_THEME_KEY,
        onRehydrateStorage: () => (state) => {
          if (state && !VALID_THEMES.includes(state.theme)) {
            state.setTheme(EAdminTheme.INDIGO);
          }
        },
      },
    ),
    {
      name: "AdminThemeStore",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);
