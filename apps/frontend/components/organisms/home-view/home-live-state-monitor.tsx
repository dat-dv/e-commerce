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
    <AnimationItem className="glass border-content/10 w-full rounded-3xl border p-6 sm:p-8">
      <div className="flex flex-col items-center gap-6">
        <div className="bg-primary/10 text-primary flex h-12 w-12 animate-pulse items-center justify-center rounded-xl">
          <BoltIcon />
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-bold tracking-widest uppercase opacity-40">
            {t("title")}
          </h2>
          <div className="flex flex-row justify-center gap-3">
            <div className="bg-content/5 border-content/10 text-content rounded-lg border px-4 py-1.5 font-mono text-xs shadow-sm">
              {t("themeLabel")}{" "}
              <span className="text-primary font-bold">
                {theme.toUpperCase()}
              </span>
            </div>
            <div className="bg-content/5 border-content/10 text-content rounded-lg border px-4 py-1.5 font-mono text-xs shadow-sm">
              {t("modeLabel")}{" "}
              <span className="text-primary font-bold">
                {isDarkMode ? t("dark") : t("light")}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs italic opacity-40">{t("description")}</p>
      </div>
    </AnimationItem>
  );
};
