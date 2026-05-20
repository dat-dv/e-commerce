import AppContainer from "@/components/atoms/app-container";
import { ReactNode } from "react";

type SidebarLayoutProps = {
  header: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
};

export default function SidebarLayout({
  header,
  sidebar,
  children,
}: SidebarLayoutProps) {
  return (
    <div className="pt-4 pb-12">
      <div className="mb-12">{header}</div>
      <AppContainer size="2xl">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="w-full lg:w-[280px] shrink-0">
            <div className="lg:sticky lg:top-48">{sidebar}</div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </AppContainer>
    </div>
  );
}
