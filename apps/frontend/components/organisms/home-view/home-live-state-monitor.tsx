"use client";

import { AnimationItem } from "@/components/atoms/animate";
import { BoltIcon } from "@/components/atoms/icons";
import { useAppConfig } from "@/hooks/config/use-config-store";
import { useTranslations } from "next-intl";

export const HomeLiveStateMonitor = () => {
  const t = useTranslations("HomePage.liveState");
  const theme = useAppConfig((state) => state.theme);
  const isDarkMode = useAppConfig((state) => state.isDarkMode);

  return (
    <AnimationItem className="glass p-6 sm:p-8 rounded-3xl border border-content/10 w-full">
      <div className="flex flex-col gap-6 items-center">
        <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center animate-pulse">
          <BoltIcon />
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-widest opacity-40">
            {t("title")}
          </h2>
          <div className="flex flex-row justify-center gap-3">
            <div className="px-4 py-1.5 rounded-lg bg-content/5 border border-content/10 font-mono text-xs text-content shadow-sm">
              {t("themeLabel")}{" "}
              <span className="text-primary font-bold">
                {theme.toUpperCase()}
              </span>
            </div>
            <div className="px-4 py-1.5 rounded-lg bg-content/5 border border-content/10 font-mono text-xs text-content shadow-sm">
              {t("modeLabel")}{" "}
              <span className="text-primary font-bold">
                {isDarkMode ? t("dark") : t("light")}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs opacity-40 italic">{t("description")}</p>
      </div>
    </AnimationItem>
  );
};
