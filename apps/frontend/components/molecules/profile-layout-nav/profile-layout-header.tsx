"use client";

import { AnimatedPageHeader } from "@ecommerce/ui";
import { Settings, ShieldCheck, Sparkles, User } from "lucide-react";
import { useTranslations } from "next-intl";

const PROFILE_ICONS = [User, Settings, ShieldCheck, Sparkles];

const ProfileLayoutHeader = () => {
  const t = useTranslations("ProfileLayout.header");

  return (
    <AnimatedPageHeader
      title={t("title")}
      highlight={t("highlight")}
      description={t("description")}
      icons={PROFILE_ICONS}
    />
  );
};

export default ProfileLayoutHeader;
