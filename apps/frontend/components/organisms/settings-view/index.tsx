"use client";

import SidebarLayout from "@/components/molecules/sidebar-layout";
import { useConfig } from "@/hooks/config/use-config";
import SettingsHeader from "./setting-header";
import SettingsSidebar from "./settings-sidebar";
import AppearanceSection from "./appearance-section";
import LanguageSection from "./language-section";

export function SettingsView() {
  const {
    theme,
    isDarkMode,
    setTheme,
    toggleDarkMode,
    language: currentLang,
    changeLanguage,
  } = useConfig();

  const tocItems = [
    { id: "appearance", title: "Appearance" },
    { id: "language", title: "Language" },
  ];

  return (
    <SidebarLayout
      header={<SettingsHeader />}
      sidebar={<SettingsSidebar items={tocItems} />}
    >
      <div className="space-y-6">
        <AppearanceSection
          theme={theme}
          isDarkMode={isDarkMode}
          setTheme={setTheme}
          toggleDarkMode={toggleDarkMode}
        />

        <LanguageSection
          currentLang={currentLang}
          changeLanguage={changeLanguage}
        />
      </div>
    </SidebarLayout>
  );
}
