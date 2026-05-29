import { AppContainer } from "@ecommerce/ui";
import ProfileLayoutHeader from "@/components/molecules/profile-layout-nav/profile-layout-header";
import ProfileLayoutNavDesktop from "@/components/molecules/profile-layout-nav/profile-layout-nav-desktop";
import { ProfileLayoutNavTabletAndBelow } from "@/components/molecules/profile-layout-nav/profile-layout-nav-tablet";
import DiscoveryCarouselSection from "@/components/organisms/discovery-sections";
import React from "react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppContainer>
      <ProfileLayoutHeader />
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
      <DiscoveryCarouselSection className="mt-20" />
    </AppContainer>
  );
}
