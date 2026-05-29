import { type ReactNode } from "react";

export interface ISidebarLayoutProps {
  header: ReactNode;
  sidebar: ReactNode;
  sidebarClassName?: string;
  children: ReactNode;
}
