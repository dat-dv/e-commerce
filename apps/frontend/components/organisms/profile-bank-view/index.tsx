"use client";

import { Button, EmptyState, FormCard } from "@ecommerce/ui";

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

      <EmptyState
        title={t("empty.title")}
        description={t("empty.description")}
        icon={CreditCard}
        className="rounded-xl border-dashed py-12"
      />
    </FormCard>
  );
}

export default ProfileBankView;
