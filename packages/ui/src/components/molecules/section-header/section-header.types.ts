import { type ElementType, type ReactNode } from "react";

export interface ISectionHeaderProps {
  title: string;
  href?: string;
  icon?: ReactNode;
  children?: ReactNode;
  linkComponent?: ElementType;
}
