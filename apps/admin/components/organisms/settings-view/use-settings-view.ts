"use client";

import { useState } from "react";

import { EAdminTheme } from "@/config/theme";
import { useAdminThemeStore } from "@/store/theme";
import { useAdminUserStore } from "@/store/user";

export const useSettingsView = () => {
  const { theme, isDarkMode, setTheme, setDarkMode } = useAdminThemeStore();
  const { user } = useAdminUserStore();

  const [themeChanging, setThemeChanging] = useState<EAdminTheme | null>(null);
  const [modeChanging, setModeChanging] = useState<"light" | "dark" | null>(
    null,
  );
  const isChanging = themeChanging !== null || modeChanging !== null;

  const handleModeChange = (dark: boolean) => {
    if (isChanging) return;
    setModeChanging(dark ? "dark" : "light");
    setTimeout(() => {
      setDarkMode(dark);
      setTimeout(() => {
        setModeChanging(null);
      }, 80);
    }, 720);
  };

  const handleThemeChange = (newTheme: EAdminTheme) => {
    if (isChanging) return;
    setThemeChanging(newTheme);
    setTimeout(() => {
      setTheme(newTheme);
      setTimeout(() => {
        setThemeChanging(null);
      }, 80);
    }, 720);
  };

  return {
    theme,
    isDarkMode,
    user,
    themeChanging,
    modeChanging,
    isChanging,
    handleModeChange,
    handleThemeChange,
  };
};
