"use client";

import { FormCard } from "@/components/atoms/form-card";
import Button from "@/components/atoms/button";
import { CreditCard, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

export function ProfileBankView(): React.ReactElement {
  const t = useTranslations("ProfileBankPage");

  return (
    <FormCard>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-content break-words">
            {t("title")}
          </h1>
          <p className="text-sm text-content/60 break-words">
            {t("description")}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          className="min-w-max"
          aria-label={t("addAccount")}
        >
          <Plus size={18} aria-hidden="true" />
          {t("addAccount")}
        </Button>
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
    </FormCard>
  );
}

export default ProfileBankView;
