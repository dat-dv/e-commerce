import { type ElementType } from "react";

export interface ISidebarDocItem {
  id: string;
  href?: string;
  routePath?: string;
  children?: ISidebarDocItem[];
}

export interface ISidebarItemProps {
  item: ISidebarDocItem;
  currentPathname: string;
  depth?: number;
  linkComponent?: ElementType;
}

export type SidebarDocItem = ISidebarDocItem;
