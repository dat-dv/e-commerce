"use client";

import AppContainer from "@/components/atoms/app-container";
import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import {
  Settings,
  SlidersHorizontal,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const SETTINGS_ICONS = [Settings, SlidersHorizontal, ShieldCheck, Sparkles];

const SettingsHeader = () => {
  return (
    <AppContainer>
      <AnimatedPageHeader
        title="Page"
        highlight="Settings"
        description="Adjust language, dark mode, colors, and interface preferences to match your personal style."
        icons={SETTINGS_ICONS}
      />
    </AppContainer>
  );
};

export default SettingsHeader;
