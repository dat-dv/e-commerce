"use client";

import { TableOfContents } from "@ecommerce/ui";
import { useState } from "react";

import { EAdminTheme } from "@/config/theme";
import { useAdminThemeStore } from "@/store/theme";
import { useAdminUserStore } from "@/store/user";

import { AppearanceTab } from "./appearance-tab";
import { ProfileTab } from "./profile-tab";
import SettingsHeader from "./settings-header";
import { SystemTab } from "./system-tab";

const TOC_ITEMS = [
  { id: "appearance", title: "Appearance" },
  { id: "profile", title: "Account Profile" },
  { id: "system", title: "System Info" },
];

export const SettingsView = () => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <SettingsHeader />

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit lg:sticky lg:top-24">
          <h3 className="mb-3 text-sm font-bold tracking-wider text-[var(--sidebar-text)]/60 uppercase">
            Preferences
          </h3>
          <TableOfContents
            items={TOC_ITEMS}
            activeItemClassName="bg-primary text-white shadow-md shadow-primary/10"
            inactiveItemClassName="text-[var(--sidebar-text)] hover:bg-white/5 hover:text-primary"
          />
        </aside>

        <div className="min-w-0 space-y-6 sm:space-y-8">
          {/* Section 1: Appearance */}
          <section
            id="appearance"
            className="relative scroll-mt-24 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-xl backdrop-blur-xl"
          >
            <AppearanceTab
              theme={theme}
              isDarkMode={isDarkMode}
              themeChanging={themeChanging}
              modeChanging={modeChanging}
              isChanging={isChanging}
              onThemeChange={handleThemeChange}
              onModeChange={handleModeChange}
            />
          </section>

          {/* Section 2: Account Profile */}
          <section
            id="profile"
            className="relative scroll-mt-24 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-xl backdrop-blur-xl"
          >
            <ProfileTab user={user} />
          </section>

          {/* Section 3: System Info */}
          <section
            id="system"
            className="relative scroll-mt-24 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-xl backdrop-blur-xl"
          >
            <SystemTab
              env={process.env.NODE_ENV || "development"}
              apiUrl={
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
              }
            />
          </section>
        </div>
      </div>
    </div>
  );
};

SettingsView.displayName = "SettingsView";
