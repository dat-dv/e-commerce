import { type ElementType } from "react";

export interface ITocItem {
  id: string;
  title: string;
}

export interface ITableOfContentsProps {
  items: ITocItem[];
  linkComponent?: ElementType;
  className?: string;
  activeItemClassName?: string;
  inactiveItemClassName?: string;
}
