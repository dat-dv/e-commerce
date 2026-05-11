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
  isLoadingTransition: boolean;
  language: string;
}

export interface ConfigHandler {
  setTheme: (theme: ETheme) => void;
  toggleDarkMode: () => void;
  setDarkMode: (isDarkMode: boolean) => void;
  setLanguage: (language: ELanguage) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export enum ELanguage {
  VI = "vi",
  EN = "en",
}
