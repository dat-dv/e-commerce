"use client";

import { useEffect } from "react";

import { useAdminThemeStore } from "@/store/theme";

export const ThemeSync = () => {
  const { theme, isDarkMode } = useAdminThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDarkMode);
    root.setAttribute("data-theme", theme);

    const darkColors: Record<string, string> = {
      blue: "#020617",
      green: "#060c09",
      orange: "#0c0a09",
      gold: "#1c1917",
    };
    const color = isDarkMode ? (darkColors[theme] ?? "#020617") : "#ffffff";

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
