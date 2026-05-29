"use client";

import { useInView, UseInViewOptions } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { WindowVirtualizer } from "virtua";

export interface VirtualListProps<T extends { id?: string | number }> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
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

/**
 * VirtualList displays virtualized vertical scroll items and triggers onLoadMore.
 */
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
  triggerMargin = "300px",
}: VirtualListProps<T>) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sentinelRef, {
    margin: triggerMargin,
  });

  const lastTriggerTime = useRef<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const now = Date.now();
    const timeSinceLastTrigger = now - lastTriggerTime.current;

    if (isInView && hasMore && !loadingMore && data.length > 0) {
      const waitTime = Math.max(500, 800 - timeSinceLastTrigger);

      timer = setTimeout(() => {
        if (isInView && !loadingMore) {
          lastTriggerTime.current = Date.now();
          onLoadMore();
        }
      }, waitTime);
    }

    return () => clearTimeout(timer);
  }, [isInView, hasMore, loadingMore, onLoadMore, data.length]);

  return (
    <div className={className} style={{ overflowAnchor: "none" }}>
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
        className="flex flex-col items-center justify-center pt-12"
        style={{ overflowAnchor: "none" }}
      >
        {loadingMore ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="border-primary/10 border-t-primary h-5 w-5 animate-spin rounded-full border-2" />
            <span className="text-content/50 text-sm font-medium">
              {loadingText}
            </span>
          </div>
        ) : hasMore ? (
          <div className="h-12" />
        ) : data.length > 0 ? (
          <div className="flex w-full items-center gap-4 px-4 py-6">
            <div className="bg-content/[0.05] h-px flex-1" />
            <span className="text-content/40 text-sm font-medium whitespace-nowrap">
              {endText}
            </span>
            <div className="bg-content/[0.05] h-px flex-1" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default VirtualList;
