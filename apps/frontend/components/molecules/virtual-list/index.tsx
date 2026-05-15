"use client";

import { useEffect, useRef } from "react";
import { useInView, UseInViewOptions } from "framer-motion";
import { WindowVirtualizer } from "virtua";

export interface VirtualListProps<T> {
  /** Array of data items to render */
  data: T[];
  /** Function to render each item */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Optional key extractor function. If not provided, falls back to id or index */
  keyExtractor?: (item: T, index: number) => string | number;
  /** Whether a background fetch is currently loading more data */
  loadingMore: boolean;
  /** Whether there is more data to load */
  hasMore: boolean;
  /** Callback triggered when the sentinel comes into view */
  onLoadMore: () => void;
  /** Text to display when loading more items */
  loadingText?: string;
  /** Text to display when all items have been loaded */
  endText?: string;
  /** Wrapper class name */
  className?: string;
  /** Item wrapper class name */
  itemClassName?: string;
  /** The margin around the sentinel before it triggers a load */
  triggerMargin?: UseInViewOptions["margin"];
}

export function VirtualList<T extends { id?: string | number }>({
  data,
  renderItem,
  keyExtractor,
  loadingMore,
  hasMore,
  onLoadMore,
  loadingText = "Loading more...",
  endText = "End of list",
  className = "space-y-8",
  itemClassName = "pb-8",
  triggerMargin = "400px",
}: VirtualListProps<T>) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sentinelRef, { margin: triggerMargin });

  useEffect(() => {
    if (isInView && hasMore && !loadingMore) {
      onLoadMore();
    }
  }, [isInView, hasMore, loadingMore, onLoadMore]);

  return (
    <div className={className}>
      <WindowVirtualizer>
        {data.map((item, index) => {
          const key = keyExtractor
            ? keyExtractor(item, index)
            : (item.id ?? index);
          return (
            <div key={key} className={itemClassName}>
              {renderItem(item, index)}
            </div>
          );
        })}
      </WindowVirtualizer>

      {/* Infinite Scroll Trigger Sentinel */}
      <div
        ref={sentinelRef}
        className="py-12 flex flex-col items-center justify-center"
      >
        {loadingMore ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-primary/10 border-t-primary rounded-full animate-spin" />
            <span className="text-[9px] uppercase tracking-[0.4em] font-black text-content/20">
              {loadingText}
            </span>
          </div>
        ) : hasMore ? (
          <div className="h-20" />
        ) : (
          <div className="py-8 flex items-center gap-4 text-content/10">
            <div className="h-[1px] w-12 bg-current" />
            <span className="text-[9px] uppercase tracking-[0.5em] font-black">
              {endText}
            </span>
            <div className="h-[1px] w-12 bg-current" />
          </div>
        )}
      </div>
    </div>
  );
}
