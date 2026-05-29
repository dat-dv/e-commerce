"use client";

import { AppContainer } from "@ecommerce/ui";
import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import {
  Settings,
  SlidersHorizontal,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";

const SETTINGS_ICONS = [Settings, SlidersHorizontal, ShieldCheck, Sparkles];

const SettingsHeader = () => {
  const t = useTranslations("SettingsPage.header");

  return (
    <AppContainer>
      <AnimatedPageHeader
        title={t("title")}
        highlight={t("highlight")}
        description={t("description")}
        icons={SETTINGS_ICONS}
      />
    </AppContainer>
  );
};

export default SettingsHeader;
