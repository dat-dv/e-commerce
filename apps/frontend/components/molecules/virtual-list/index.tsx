"use client";

import { useEffect, useRef } from "react";
import { useInView, UseInViewOptions } from "framer-motion";
import { WindowVirtualizer } from "virtua";

export interface VirtualListProps<T> {
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
  triggerMargin = "300px", // Standard list margin
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
            <div className="w-5 h-5 border-2 border-primary/10 border-t-primary rounded-full animate-spin" />
            <span className="text-sm font-medium text-content/50">
              {loadingText}
            </span>
          </div>
        ) : hasMore ? (
          <div className="h-12" />
        ) : data.length > 0 ? (
          <div className="py-6 flex items-center gap-4 w-full px-4">
            <div className="h-px flex-1 bg-content/[0.05]" />
            <span className="text-sm font-medium text-content/40 whitespace-nowrap">
              {endText}
            </span>
            <div className="h-px flex-1 bg-content/[0.05]" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
