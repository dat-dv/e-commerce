import { type ReactNode } from "react";

export interface ILazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  threshold?: number;
}
