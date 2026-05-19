"use client";

import React from "react";
import { User, Settings, ShieldCheck, Sparkles } from "lucide-react";
import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import AppContainer from "@/components/atoms/app-container";
import { useTranslations } from "next-intl";

const PROFILE_ICONS = [User, Settings, ShieldCheck, Sparkles];

const ProfileSettingsSidebarHeader = () => {
  const t = useTranslations("ProfileLayout.header");

  return (
    <AppContainer>
      <AnimatedPageHeader
        title={t("title")}
        highlight={t("highlight")}
        description={t("description")}
        icons={PROFILE_ICONS}
      />
    </AppContainer>
  );
};

export default ProfileSettingsSidebarHeader;
