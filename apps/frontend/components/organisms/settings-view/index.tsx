"use client";

import SidebarLayout from "@/components/molecules/sidebar-layout";
import TableOfContents from "@/components/molecules/toc";
import { THEMES } from "@/config/config";
import { useConfig } from "@/hooks/config/use-config";
import { motion } from "framer-motion";
import { ELanguage } from "@/store/config/config.types";

export function SettingsView() {
  const {
    theme,
    isDarkMode,
    setTheme,
    toggleDarkMode,
    language: currentLang,
    setLanguage,
  } = useConfig();

  const changeLanguage = (newLang: ELanguage) => {
    if (currentLang === newLang) return;

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
    // eslint-disable-next-line react-hooks/immutability
    window.location.href = url.toString();
  };

  const header = (
    <div className="mb-10">
      <h1 className="text-3xl font-black text-content mb-2">Settings</h1>
      <p className="text-content/60 text-base">
        Manage your account preferences and appearance.
      </p>
    </div>
  );

  const tocItems = [
    { id: "appearance", title: "Appearance" },
    { id: "language", title: "Language" },
  ];

  const sidebar = (
    <div>
      <h3 className="text-sm font-bold text-content/40 uppercase tracking-wider mb-3">
        Settings
      </h3>
      <TableOfContents items={tocItems} />
    </div>
  );

  return (
    <SidebarLayout header={header} sidebar={sidebar}>
      <div className="space-y-6">
        {/* Appearance Section */}
        <div
          id="appearance"
          className="border border-content/10 rounded-xl p-6 bg-surface scroll-mt-24"
        >
          <h2 className="text-lg font-bold text-content mb-4">Appearance</h2>

          {/* Theme Color */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-content/5 pb-4 mb-4 gap-4">
            <div>
              <span className="font-medium text-content block">
                Theme Color
              </span>
              <span className="text-sm text-content/60">
                Choose your preferred accent color.
              </span>
            </div>
            <div className="flex items-center gap-3">
              {THEMES.map((t) => {
                const active = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`w-8 h-8 rounded-full transition-all flex items-center justify-center ${
                      active
                        ? "ring-2 ring-primary ring-offset-2 scale-110"
                        : "opacity-70 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: t.color }}
                    title={t.label}
                  >
                    {active && <span className="text-white text-xs">✓</span>}
                  </button>
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
              <span
                className={`${
                  isDarkMode ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
          </div>
        </div>

        {/* Language Section */}
        <div
          id="language"
          className="border border-content/10 rounded-xl p-6 bg-surface/50 backdrop-blur-md scroll-mt-24"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-medium text-content block">Language</span>
              <span className="text-sm text-content/60">
                Select your preferred language. This will change the subdomain.
              </span>
            </div>
            <div className="flex items-center gap-3">
              {Object.values(ELanguage).map((value) => (
                <motion.button
                  key={value}
                  onClick={() => changeLanguage(value)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    currentLang === value
                      ? "bg-primary text-white border-primary"
                      : "border-content/10 text-content hover:bg-content/5"
                  }`}
                >
                  {value}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
