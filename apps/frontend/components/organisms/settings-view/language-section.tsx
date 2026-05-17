"use client";

import React from "react";
import { motion } from "framer-motion";
import { ELanguage } from "@/store/config/config.types";

interface LanguageSectionProps {
  currentLang: string;
  changeLanguage: (newLang: ELanguage) => void;
}

const LanguageSection = ({
  currentLang,
  changeLanguage,
}: LanguageSectionProps) => {
  return (
    <div
      id="language"
      className="border border-content/10 rounded-xl p-6 bg-surface/50 backdrop-blur-md scroll-mt-24"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-medium text-content block">Language</span>
          <span className="text-sm text-content/60">
            Select your preferred language. This will change the subdomain.
          </span>
        </div>
        <div className="flex items-center gap-3">
          {Object.values(ELanguage).map((value) => (
            <motion.button
              key={value}
              onClick={() => changeLanguage(value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg border transition-all ${
                currentLang === value
                  ? "bg-primary text-white border-primary"
                  : "border-content/10 text-content hover:bg-content/5"
              }`}
            >
              {value}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSection;
