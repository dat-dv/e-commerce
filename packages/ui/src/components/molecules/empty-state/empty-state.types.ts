import { type LucideIcon } from "lucide-react";
import React from "react";

export interface IEmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  actionHref?: string;
  linkComponent?: React.ElementType;
  children?: React.ReactNode;
  className?: string;
  delay?: number;
}
