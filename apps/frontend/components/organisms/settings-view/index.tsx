"use client";

import { SidebarLayout } from "@ecommerce/ui";
import { useConfig } from "@/hooks/config/use-config";
import { useTranslations } from "next-intl";
import AppearanceSection from "./appearance-section";
import LanguageSection from "./language-section";
import SettingsHeader from "./setting-header";
import SettingsSidebar from "./settings-sidebar";

export function SettingsView() {
  const t = useTranslations("SettingsPage.navigation");
  const {
    theme,
    isDarkMode,
    setTheme,
    toggleDarkMode,
    language: currentLang,
    changeLanguage,
  } = useConfig();

  const tocItems = [
    { id: "appearance", title: t("appearance") },
    { id: "language", title: t("language") },
  ];

  return (
    <SidebarLayout
      header={<SettingsHeader />}
      sidebar={<SettingsSidebar items={tocItems} />}
    >
      <div className="min-w-0 space-y-4 sm:space-y-6">
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
