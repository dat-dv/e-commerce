import { type ElementType } from "react";

import { type SidebarDocItem } from "../../atoms/sidebar-item";

export interface IDocsSidebarProps {
  items: SidebarDocItem[];
  currentPathname: string;
  titleLabel?: string;
  linkComponent?: ElementType;
}
