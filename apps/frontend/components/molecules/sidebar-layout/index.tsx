import { ReactNode } from "react";
import AppContainer from "@/components/atoms/app-container";

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
    <AppContainer
      size="2xl"
      className="py-12 animate-in fade-in slide-in-from-bottom-6 duration-700"
    >
      {/* Header */}
      <div className="mb-12">{header}</div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar (Left) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 space-y-6 scrollbar-thin scrollbar-thumb-content/10 scrollbar-track-transparent">
            {sidebar}
          </div>
        </div>

        {/* Main Content (Right) */}
        <div className="lg:col-span-3">{children}</div>
      </div>
    </AppContainer>
  );
}
