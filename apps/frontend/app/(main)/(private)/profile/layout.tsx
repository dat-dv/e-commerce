import AppContainer from "@/components/atoms/app-container";
import ProfileLayoutNavDesktop from "@/components/molecules/profile-layout-nav/profile-layout-nav-desktop";
import { ProfileLayoutNavTabletAndBelow } from "@/components/molecules/profile-layout-nav/profile-layout-nav-tablet";
import ProfileSettingsSidebarHeader from "@/components/molecules/profile-layout-nav/profile-sidebar-header";
import React from "react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-2 pb-10 sm:pt-4 sm:pb-12">
      <ProfileSettingsSidebarHeader />
      <AppContainer size="2xl">
        <div className="lg:hidden">
          <ProfileLayoutNavTabletAndBelow />
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <aside className="hidden w-full shrink-0 lg:block lg:w-[280px]">
            <div className="lg:sticky lg:top-48">
              <ProfileLayoutNavDesktop />
            </div>
          </aside>

          <main className="mt-12 min-w-0 flex-1 lg:mt-0">{children}</main>
        </div>
      </AppContainer>
    </div>
  );
}
