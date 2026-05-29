import { type UseInViewOptions } from "framer-motion";
import { type ReactNode } from "react";

export interface IVirtualGridColumns {
  base: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

export interface IVirtualGridProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;
  columns?: IVirtualGridColumns;
  gap?: number;
  loadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingText?: string;
  endText?: string;
  className?: string;
  gridClassName?: string;
  itemClassName?: string;
  rowClassName?: string;
  triggerMargin?: UseInViewOptions["margin"];
}
