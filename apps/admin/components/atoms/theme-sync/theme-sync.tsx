"use client";

import { useEffect } from "react";

import { DARK_BG, LIGHT_BG } from "@/config/theme";
import { useAdminThemeStore } from "@/store/theme";

export const ThemeSync = () => {
  const { theme, isDarkMode } = useAdminThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDarkMode);
    root.setAttribute("data-theme", theme);

    const bgMap = isDarkMode ? DARK_BG : LIGHT_BG;
    const color = bgMap[theme] ?? (isDarkMode ? "#0f1117" : "#f8f9fc");

    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", color);
  }, [theme, isDarkMode]);

  return null;
};

ThemeSync.displayName = "ThemeSync";
