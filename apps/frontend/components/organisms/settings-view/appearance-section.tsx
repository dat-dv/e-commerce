"use client";

import React from "react";
import { motion } from "framer-motion";
import { THEMES } from "@/config/config";
import { ETheme } from "@/constants/theme.constanst";

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
  return (
    <div
      id="appearance"
      className="border border-content/10 rounded-xl p-6 bg-surface/50 backdrop-blur-md scroll-mt-24"
    >
      <h2 className="text-lg font-bold text-content mb-4">Appearance</h2>

      {/* Theme Color */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-content/5 pb-4 mb-4 gap-4">
        <div>
          <span className="font-medium text-content block">Theme Color</span>
          <span className="text-sm text-content/60">
            Choose your preferred accent color.
          </span>
        </div>
        <div className="flex items-center gap-3">
          {THEMES.map((t) => {
            const active = theme === t.id;
            return (
              <motion.button
                key={t.id}
                onClick={() => setTheme(t.id)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className={`w-8 h-8 rounded-full transition-all flex items-center justify-center ${
                  active
                    ? "ring-2 ring-primary ring-offset-2 scale-110"
                    : "opacity-70 hover:opacity-100"
                }`}
                style={{ backgroundColor: t.color }}
                title={t.label}
              >
                {active && <span className="text-white text-xs">✓</span>}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Dark Mode */}
      <div className="flex items-center justify-between">
        <div>
          <span className="font-medium text-content block">Dark Mode</span>
          <span className="text-sm text-content/60">
            Switch between light and dark themes.
          </span>
        </div>
        <button
          onClick={toggleDarkMode}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
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
