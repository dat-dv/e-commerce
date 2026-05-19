"use client";

import React from "react";
import { Plus, CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";

export function ProfileBankView(): React.ReactElement {
  const t = useTranslations("ProfileBankPage");

  return (
    <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-content break-words">
            {t("title")}
          </h1>
          <p className="text-sm text-content/60 break-words">
            {t("description")}
          </p>
        </div>
        <button
          className="inline-flex min-w-max items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors"
          aria-label={t("addAccount")}
        >
          <Plus size={18} aria-hidden="true" />
          {t("addAccount")}
        </button>
      </div>

      <div className="border-2 border-dashed border-content/10 rounded-xl p-8 text-center flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 bg-content/5 rounded-full flex items-center justify-center text-content/40">
          <CreditCard size={24} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-content break-words">
            {t("empty.title")}
          </p>
          <p className="text-sm text-content/50 break-words">
            {t("empty.description")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileBankView;
