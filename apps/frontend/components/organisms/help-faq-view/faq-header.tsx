"use client";

import React from "react";
import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import AppContainer from "@/components/atoms/app-container";
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
