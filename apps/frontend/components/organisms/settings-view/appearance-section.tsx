"use client";

import Switch from "@/components/atoms/switch";
import ThemeSwatch from "@/components/atoms/theme-swatch";
import { THEMES } from "@/config/config";
import { ETheme } from "@/constants/theme.constanst";
import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
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
      className={cn(
        UI_RADIUS.panel,
        "border-content/10 bg-surface/50 min-w-0 scroll-mt-24 border p-4 backdrop-blur-md sm:p-6",
      )}
    >
      <h2 className="text-content mb-4 text-lg font-bold">{t("title")}</h2>

      <div className="border-content/5 mb-4 flex min-w-0 flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <span className="text-content block font-medium">
            {t("themeColor.label")}
          </span>
          <span className="text-content/60 text-sm break-words">
            {t("themeColor.description")}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:shrink-0 sm:justify-end">
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
                {active && <span className="text-xs text-white">✓</span>}
              </ThemeSwatch>
            );
          })}
        </div>
      </div>

      <div className="flex min-w-0 items-center justify-between gap-4">
        <div className="min-w-0">
          <span className="text-content block font-medium">
            {t("darkMode.label")}
          </span>
          <span className="text-content/60 text-sm break-words">
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
