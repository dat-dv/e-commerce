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
      className="border border-content/10 rounded-xl p-6 bg-surface/50 backdrop-blur-md scroll-mt-24"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <span className="font-medium text-content block">{t("label")}</span>
          <span className="text-sm text-content/60 break-words">
            {t("description")}
          </span>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3 sm:justify-end">
          {Object.values(ELanguage).map((value) => (
            <motion.button
              key={value}
              onClick={() => changeLanguage(value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={t("select", { language: t(`options.${value}`) })}
              className={`px-4 py-2 rounded-lg border transition-all ${
                currentLang === value
                  ? "bg-primary text-white border-primary"
                  : "border-content/10 text-content hover:bg-content/5"
              }`}
            >
              {t(`options.${value}`)}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSection;
