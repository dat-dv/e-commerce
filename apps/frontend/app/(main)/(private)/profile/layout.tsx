import AppContainer from "@/components/atoms/app-container";
import ProfileSettingsSidebar from "@/components/molecules/profile-setting-sidebar";
import { ProfileSettingNavTablet } from "@/components/molecules/profile-setting-sidebar/profile-setting-nav-tablet";
import {
  RenderDesktopOnly,
  RenderTabletAndBelow,
} from "@/components/molecules/responsive";
import React from "react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RenderDesktopOnly>
        <ProfileSettingsSidebar>{children}</ProfileSettingsSidebar>
      </RenderDesktopOnly>
      <RenderTabletAndBelow>
        <AppContainer>
          <ProfileSettingNavTablet>{children}</ProfileSettingNavTablet>
        </AppContainer>
      </RenderTabletAndBelow>
    </>
  );
}
