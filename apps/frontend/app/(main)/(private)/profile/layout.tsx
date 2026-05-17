import React from "react";
import ProfileSettingsSidebar from "@/components/molecules/profile-setting-sidebar";
export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProfileSettingsSidebar>{children}</ProfileSettingsSidebar>;
}
