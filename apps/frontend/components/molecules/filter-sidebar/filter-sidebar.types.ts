import { type ReactNode } from "react";

export interface IFilterSidebarProps {
  children?: ReactNode;
}

export interface IFilterSectionProps {
  title: string;
  icon?: ReactNode;
  children?: ReactNode;
  defaultExpanded?: boolean;
}
