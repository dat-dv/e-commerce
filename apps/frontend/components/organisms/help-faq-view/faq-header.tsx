"use client";

import { AnimatedPageHeader, AppContainer } from "@ecommerce/ui";
import React from "react";

import { useTranslations } from "next-intl";
import {
  CreditCard,
  HelpCircle,
  Keyboard,
  ShieldAlert,
  Ship,
} from "lucide-react";

export function FAQHeader(): React.ReactElement {
  const t = useTranslations("HelpCenter.headers.faq");

  return (
    <AppContainer>
      <AnimatedPageHeader
        title={t("title")}
        highlight={t("highlight")}
        description={t("description")}
        icons={[HelpCircle, ShieldAlert, CreditCard, Ship, Keyboard]}
        center
      />
    </AppContainer>
  );
}

export default FAQHeader;
