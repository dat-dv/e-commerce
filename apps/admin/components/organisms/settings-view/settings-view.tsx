"use client";

import { BasicLoading, Tab, TabList, TabPanel, Tabs } from "@ecommerce/ui";
import { Server, Sliders, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { EAdminTheme } from "@/config/theme";
import { APP_ROUTES } from "@/constants/routes";
import { useAdminThemeStore } from "@/store/theme";
import { useAdminUserStore } from "@/store/user";

import { AppearanceTab } from "./appearance-tab";
import { ProfileTab } from "./profile-tab";
import SettingsHeader from "./settings-header";
import { SystemTab } from "./system-tab";

const SETTINGS_TABS = [
  { id: "appearance", label: "Appearance", icon: Sliders },
  { id: "profile", label: "Account Profile", icon: User },
  { id: "system", label: "System Info", icon: Server },
] as const;

type TabType = (typeof SETTINGS_TABS)[number]["id"];

/**
 * SettingsView component coordinates the settings sections and sidebar nav tabs
 * using the generic Tabs molecules package.
 */
export const SettingsView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabType) || "appearance";
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  const { theme, isDarkMode, setTheme, setDarkMode } = useAdminThemeStore();
  const { user } = useAdminUserStore();

  const [themeChanging, setThemeChanging] = useState<EAdminTheme | null>(null);
  const [modeChanging, setModeChanging] = useState<"light" | "dark" | null>(
    null,
  );
  const isChanging = themeChanging !== null || modeChanging !== null;

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    router.replace(`${APP_ROUTES.SETTINGS}?tab=${tab}`);
  };

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
    <>
      {isChanging && <BasicLoading isBlur={false} />}

      <div className="mx-auto max-w-4xl space-y-6 pb-10">
        <SettingsHeader />
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={(key) => handleTabChange(key as TabType)}
          orientation="vertical"
          className="grid gap-6 md:grid-cols-[200px_1fr]"
        >
          {/* Sidebar Nav */}
          <TabList className="flex flex-row gap-1 overflow-visible border-b-0 md:h-fit md:flex-col">
            {SETTINGS_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <Tab
                  key={tab.id}
                  id={tab.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm font-semibold transition-all ${
                    isActive
                      ? "border-indigo-500/20 bg-indigo-500/15 text-indigo-400 shadow-sm"
                      : "border-transparent text-[var(--muted)] hover:bg-white/5 hover:text-[var(--app-text)]"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {tab.label}
                </Tab>
              );
            })}
          </TabList>

          {/* Tab Panel */}
          <div className="relative rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-xl backdrop-blur-xl">
            {/* Glass Loading Overlay */}

            {/* TAB 1: Appearance */}
            <TabPanel id="appearance" className="mt-0">
              <AppearanceTab
                theme={theme}
                isDarkMode={isDarkMode}
                themeChanging={themeChanging}
                modeChanging={modeChanging}
                isChanging={isChanging}
                onThemeChange={handleThemeChange}
                onModeChange={handleModeChange}
              />
            </TabPanel>

            {/* TAB 2: Profile */}
            <TabPanel id="profile" className="mt-0">
              <ProfileTab user={user} />
            </TabPanel>

            {/* TAB 3: System Info */}
            <TabPanel id="system" className="mt-0">
              <SystemTab
                env={process.env.NODE_ENV || "development"}
                apiUrl={
                  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
                }
              />
            </TabPanel>
          </div>
        </Tabs>
      </div>
    </>
  );
};

SettingsView.displayName = "SettingsView";
