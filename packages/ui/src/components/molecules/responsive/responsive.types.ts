import { type ReactNode } from "react";

export interface IResponsiveRenderProps {
  children: ReactNode;
  fallback?: ReactNode;
  fallbackClassName?: string;
  query: string;
  isFallbackChildren?: boolean;
}

export interface IResponsiveOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
  isFallbackChildren?: boolean;
}
