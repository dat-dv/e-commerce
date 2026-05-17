"use client";

import React from "react";
import SidebarLayout from "@/components/molecules/sidebar-layout";
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
