"use client";

import { motion } from "framer-motion";
import { ELanguage } from "@/store/config/config.types";
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
      className="min-w-0 rounded-xl border border-content/10 bg-surface/50 p-4 backdrop-blur-md scroll-mt-24 sm:p-6"
    >
      <div className="flex min-w-0 flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <span className="font-medium text-content block">{t("label")}</span>
          <span className="text-sm text-content/60 break-words">
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
              className={`min-w-0 rounded-lg border px-4 py-2 text-sm font-semibold transition-all ${
                currentLang === value
                  ? "bg-primary text-white border-primary"
                  : "border-content/10 text-content hover:bg-content/5"
              }`}
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
