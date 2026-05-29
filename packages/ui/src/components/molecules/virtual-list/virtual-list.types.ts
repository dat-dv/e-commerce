import { type UseInViewOptions } from "framer-motion";
import { type ReactNode } from "react";

export interface IVirtualListProps<T extends { id?: string | number }> {
  data: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  loadingText?: string;
  endText?: string;
  className?: string;
  itemClassName?: string;
  triggerMargin?: UseInViewOptions["margin"];
}
