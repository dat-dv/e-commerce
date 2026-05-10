import { ETheme } from "@/constants/theme.constanst";

export interface IThemeConfig {
  isDarkMode: boolean;
  theme: ETheme;
}

export interface ConfigStore extends ConfigState, ConfigHandler {}

export interface ConfigState {
  theme: ETheme;
  isDarkMode: boolean;
  _hasHydrated: boolean;
}

export interface ConfigHandler {
  setTheme: (theme: ETheme) => void;
  toggleDarkMode: () => void;
  setDarkMode: (isDarkMode: boolean) => void;
  setHasHydrated: (state: boolean) => void;
}
