import { cn } from "../../../utils";
import { AppContainer } from "../../atoms/app-container";
import { ISidebarLayoutProps } from "./sidebar-layout.types";

export default function SidebarLayout({
  header,
  sidebar,
  sidebarClassName,
  children,
}: ISidebarLayoutProps) {
  return (
    <div className="pt-2 pb-10 sm:pt-4 sm:pb-12">
      <div className="mb-8 sm:mb-12">{header}</div>
      <AppContainer size="2xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          {/* Sidebar */}
          <aside
            className={cn("w-full shrink-0 lg:w-[280px]", sidebarClassName)}
          >
            <div className="lg:sticky lg:top-48">{sidebar}</div>
          </aside>

          {/* Content */}
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </AppContainer>
    </div>
  );
}

SidebarLayout.displayName = "SidebarLayout";
