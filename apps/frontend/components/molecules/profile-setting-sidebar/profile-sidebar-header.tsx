"use client";

import React from "react";
import { User, Settings, ShieldCheck, Sparkles } from "lucide-react";
import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import AppContainer from "@/components/atoms/app-container";

const PROFILE_ICONS = [User, Settings, ShieldCheck, Sparkles];

const ProfileSettingsSidebarHeader = () => {
  return (
    <AppContainer>
      <AnimatedPageHeader
        title="Profile"
        highlight="Settings"
        description="Manage your profile and jump back into the products you care about."
        icons={PROFILE_ICONS}
      />
    </AppContainer>
  );
};

export default ProfileSettingsSidebarHeader;
