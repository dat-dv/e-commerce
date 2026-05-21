"use client";

import { UI_RADIUS } from "@/constants/ui-radius";
import { ELanguage } from "@/store/config/config.types";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface LanguageSectionProps {
  currentLang: string;
  changeLanguage: (newLang: ELanguage) => void;
}

const LanguageSection = ({
  currentLang,
  changeLanguage,
}: LanguageSectionProps) => {
  const t = useTranslations("SettingsPage.language");

  return (
    <div
      id="language"
      className={cn(
        UI_RADIUS.panel,
        "border-content/10 bg-surface/50 min-w-0 scroll-mt-24 border p-4 backdrop-blur-md sm:p-6",
      )}
    >
      <div className="flex min-w-0 flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <span className="text-content block font-medium">{t("label")}</span>
          <span className="text-content/60 text-sm break-words">
            {t("description")}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:flex sm:shrink-0 sm:flex-wrap sm:items-center sm:justify-end">
          {Object.values(ELanguage).map((value) => (
            <motion.button
              key={value}
              onClick={() => changeLanguage(value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={t("select", { language: t(`options.${value}`) })}
              className={cn(
                UI_RADIUS.control,
                "min-w-0 border px-4 py-2 text-sm font-semibold transition-all",
                currentLang === value
                  ? "bg-primary border-primary text-white"
                  : "border-content/10 text-content hover:bg-content/5",
              )}
            >
              <span className="block truncate">{t(`options.${value}`)}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSection;
