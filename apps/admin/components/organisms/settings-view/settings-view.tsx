"use client";

import { TableOfContents } from "@ecommerce/ui";
import React from "react";

import { SettingsHeader } from "@/components/molecules/settings-header";
import { AppearanceTab } from "@/components/organisms/settings-view/settings-appearance-tab";
import { ProfileTab } from "@/components/organisms/settings-view/settings-profile-tab";
import { useSettingsView } from "@/hooks/settings/use-settings-view";

const TOC_ITEMS = [
  { id: "appearance", title: "Appearance" },
  { id: "profile", title: "Account Profile" },
];

export const SettingsView = () => {
  const {
    theme,
    isDarkMode,
    user,
    themeChanging,
    modeChanging,
    isChanging,
    handleModeChange,
    handleThemeChange,
  } = useSettingsView();

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
        </div>
      </div>
    </div>
  );
};

SettingsView.displayName = "SettingsView";
