"use client";

import SidebarLayout from "@/components/molecules/sidebar-layout";
import React from "react";
import ProfileSettingsSidebarHeader from "./profile-sidebar-header";
import ProfileSidebarSection from "./profile-sidebar-section";

export default function ProfileSettingsSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarLayout
      header={<ProfileSettingsSidebarHeader />}
      sidebar={<ProfileSidebarSection />}
    >
      {children}
    </SidebarLayout>
  );
}
