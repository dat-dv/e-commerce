"use client";

import React from "react";
import { User, Settings, ShieldCheck, Sparkles } from "lucide-react";
import AnimatedPageHeader from "@/components/molecules/page-header-animation";

const PROFILE_ICONS = [User, Settings, ShieldCheck, Sparkles];

const ProfileSettingsSidebarHeader = () => {
  return (
    <AnimatedPageHeader
      title="Your"
      highlight="Account"
      description="Manage your profile and jump back into the products you care about."
      icons={PROFILE_ICONS}
    />
  );
};

export default ProfileSettingsSidebarHeader;
