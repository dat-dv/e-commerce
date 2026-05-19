"use client";

import { useCallback } from "react";

import { ETheme } from "@/constants/theme.constanst";

import { useAppConfig } from "../use-config-store";
import { ELanguage } from "@/store/config/config.types";

export const useConfig = () => {
  const theme = useAppConfig((s) => s.theme);
  const isDarkMode = useAppConfig((s) => s.isDarkMode);

  const setThemeStore = useAppConfig((s) => s.setTheme);
  const setDarkModeStore = useAppConfig((s) => s.setDarkMode);
  const toggleDarkModeStore = useAppConfig((s) => s.toggleDarkMode);
  const language = useAppConfig((s) => s.language);
  const setLanguage = useAppConfig((s) => s.setLanguage);

  const setTheme = useCallback(
    (newTheme: ETheme) => {
      setThemeStore(newTheme);
      document?.documentElement?.setAttribute("data-theme", newTheme);
    },
    [setThemeStore],
  );

  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !isDarkMode;
    toggleDarkModeStore();
    document?.documentElement?.classList.toggle("dark", newDarkMode);
  }, [isDarkMode, toggleDarkModeStore]);

  const setDarkMode = useCallback(
    (isDarkMode: boolean) => {
      setDarkModeStore(isDarkMode);
      document?.documentElement?.classList.toggle("dark", isDarkMode);
    },
    [setDarkModeStore],
  );

  const changeLanguage = useCallback(
    (newLang: ELanguage) => {
      if (language === newLang) return;

      const url = new URL(window.location.href);
      const hostParts = url.hostname.split(".");
      if (
        hostParts.length >= 2 &&
        (hostParts[0].length <= 3 || hostParts[0] === "www")
      ) {
        hostParts[0] = newLang;
      } else {
        hostParts.unshift(newLang);
      }

      url.hostname = hostParts.join(".");
      setLanguage(newLang);

      window.location.href = url.toString();
    },
    [language, setLanguage],
  );

  return {
    theme,
    isDarkMode,
    setTheme,
    toggleDarkMode,
    setDarkMode,
    language,
    changeLanguage,
  };
};
