"use client";

import { Button, FormCard } from "@ecommerce/ui";

import { CreditCard, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

export function ProfileBankView(): React.ReactElement {
  const t = useTranslations("ProfileBankPage");

  return (
    <FormCard>
      <div className="mb-6 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-content text-2xl font-bold break-words">
            {t("title")}
          </h1>
          <p className="text-content/60 text-sm break-words">
            {t("description")}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          className="w-full justify-center sm:w-auto sm:shrink-0"
          aria-label={t("addAccount")}
        >
          <Plus size={18} aria-hidden="true" />
          <span className="truncate">{t("addAccount")}</span>
        </Button>
      </div>

      <div className="border-content/10 flex min-w-0 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-5 text-center sm:p-8">
        <div className="bg-content/5 text-content/40 flex h-12 w-12 items-center justify-center rounded-full">
          <CreditCard size={24} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-content font-semibold break-words">
            {t("empty.title")}
          </p>
          <p className="text-content/50 text-sm break-words">
            {t("empty.description")}
          </p>
        </div>
      </div>
    </FormCard>
  );
}

export default ProfileBankView;
