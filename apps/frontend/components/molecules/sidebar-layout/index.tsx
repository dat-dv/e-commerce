import AppContainer from "@/components/atoms/app-container";
import { cn } from "@/utils/cn";
import { ReactNode } from "react";

type SidebarLayoutProps = {
  header: ReactNode;
  sidebar: ReactNode;
  sidebarClassName?: string;
  children: ReactNode;
};

export default function SidebarLayout({
  header,
  sidebar,
  sidebarClassName,
  children,
}: SidebarLayoutProps) {
  return (
    <div className="pb-10 pt-2 sm:pb-12 sm:pt-4">
      <div className="mb-8 sm:mb-12">{header}</div>
      <AppContainer size="2xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          {/* Sidebar */}
          <aside
            className={cn("w-full lg:w-[280px] shrink-0", sidebarClassName)}
          >
            <div className="lg:sticky lg:top-48">{sidebar}</div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </AppContainer>
    </div>
  );
}
