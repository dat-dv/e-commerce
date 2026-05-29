import { type ElementType, type ReactNode } from "react";

export interface IEmptyStateProps {
  icon?: ElementType;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}
