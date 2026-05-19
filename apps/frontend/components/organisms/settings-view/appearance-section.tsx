"use client";

import React from "react";
import { motion } from "framer-motion";
import { THEMES } from "@/config/config";
import { ETheme } from "@/constants/theme.constanst";
import { useTranslations } from "next-intl";

interface AppearanceSectionProps {
  theme: ETheme;
  isDarkMode: boolean;
  setTheme: (theme: ETheme) => void;
  toggleDarkMode: () => void;
}

const AppearanceSection = ({
  theme,
  isDarkMode,
  setTheme,
  toggleDarkMode,
}: AppearanceSectionProps) => {
  const t = useTranslations("SettingsPage.appearance");

  return (
    <div
      id="appearance"
      className="border border-content/10 rounded-xl p-6 bg-surface/50 backdrop-blur-md scroll-mt-24"
    >
      <h2 className="text-lg font-bold text-content mb-4">{t("title")}</h2>

      {/* Theme Color */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-content/5 pb-4 mb-4 gap-4">
        <div className="min-w-0">
          <span className="font-medium text-content block">
            {t("themeColor.label")}
          </span>
          <span className="text-sm text-content/60 break-words">
            {t("themeColor.description")}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {THEMES.map((themeOption) => {
            const themeName = t(`themes.${themeOption.id}`);
            const active = theme === themeOption.id;
            return (
              <motion.button
                key={themeOption.id}
                onClick={() => setTheme(themeOption.id)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className={`w-8 h-8 rounded-full transition-all flex items-center justify-center ${
                  active
                    ? "ring-2 ring-primary ring-offset-2 scale-110"
                    : "opacity-70 hover:opacity-100"
                }`}
                style={{ backgroundColor: themeOption.color }}
                title={themeName}
                aria-label={t("themeColor.select", {
                  theme: themeName,
                })}
              >
                {active && <span className="text-white text-xs">✓</span>}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Dark Mode */}
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <span className="font-medium text-content block">
            {t("darkMode.label")}
          </span>
          <span className="text-sm text-content/60 break-words">
            {t("darkMode.description")}
          </span>
        </div>
        <button
          onClick={toggleDarkMode}
          aria-label={t("darkMode.toggle")}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none ${
            isDarkMode ? "bg-primary" : "bg-content/10"
          }`}
        >
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`inline-block h-4 w-4 transform rounded-full bg-white ${
              isDarkMode ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default AppearanceSection;
