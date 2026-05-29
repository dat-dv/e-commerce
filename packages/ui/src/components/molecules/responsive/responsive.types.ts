import { type ReactNode } from "react";

export interface IResponsiveRenderProps {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export interface IResponsiveOnlyProps {
  children: ReactNode;
  on: "mobile" | "tablet" | "desktop";
}
