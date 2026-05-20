"use client";

import Switch from "@/components/atoms/switch";
import ThemeSwatch from "@/components/atoms/theme-swatch";
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
              <ThemeSwatch
                key={themeOption.id}
                onClick={() => setTheme(themeOption.id)}
                color={themeOption.color}
                selected={active}
                title={themeName}
                aria-label={t("themeColor.select", {
                  theme: themeName,
                })}
              >
                {active && <span className="text-white text-xs">✓</span>}
              </ThemeSwatch>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <span className="font-medium text-content block">
            {t("darkMode.label")}
          </span>
          <span className="text-sm text-content/60 break-words">
            {t("darkMode.description")}
          </span>
        </div>
        <Switch
          checked={isDarkMode}
          onCheckedChange={toggleDarkMode}
          aria-label={t("darkMode.toggle")}
        />
      </div>
    </div>
  );
};

export default AppearanceSection;
