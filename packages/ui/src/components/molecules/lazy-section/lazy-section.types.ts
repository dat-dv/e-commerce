import { type ReactNode } from "react";

export interface ILazySectionProps {
  children: ReactNode;
  placeholder?: ReactNode;
  rootMargin?: string;
  className?: string;
  threshold?: number;
}
