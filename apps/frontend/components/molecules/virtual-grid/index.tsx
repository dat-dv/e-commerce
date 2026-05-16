"use client";

import { useEffect, useMemo, useRef } from "react";
import { useInView, UseInViewOptions } from "framer-motion";
import { WindowVirtualizer } from "virtua";

type VirtualItemWithId = {
  id?: string | number;
};

const getVirtualItemId = <T,>(item: T): string | number | undefined => {
  if (typeof item !== "object" || item === null || !("id" in item)) {
    return undefined;
  }

  const value = (item as VirtualItemWithId).id;
  return typeof value === "string" || typeof value === "number"
    ? value
    : undefined;
};

export interface VirtualGridProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  loadingText?: string;
  endText?: string;
  gridClassName?: string;
  itemClassName?: string;
  triggerMargin?: UseInViewOptions["margin"];
}

export function VirtualGrid<T>({
  data,
  renderItem,
  keyExtractor,
  loadingMore,
  hasMore,
  onLoadMore,
  loadingText = "Loading more...",
  endText = "All items loaded",
  gridClassName = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
  itemClassName = "",
  triggerMargin = "200px", // Reduced margin to avoid double-triggering in grids
}: VirtualGridProps<T>) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sentinelRef, {
    margin: triggerMargin,
  });

  // Use a ref to track the last time we triggered a load
  const lastTriggerTime = useRef<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const now = Date.now();
    const timeSinceLastTrigger = now - lastTriggerTime.current;

    if (isInView && hasMore && !loadingMore && data.length > 0) {
      // If we just finished a load, wait at least 800ms before allowing another one
      // to let the DOM settle and items measure.
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

  const rows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < data.length; i += 4) {
      rows.push(data.slice(i, i + 4));
    }
    return rows;
  }, [data]);

  return (
    <div className="flex flex-col" style={{ overflowAnchor: "none" }}>
      <WindowVirtualizer>
        {rows.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className={gridClassName}>
            {row.map((item, index) => {
              const actualIndex = rowIndex * 4 + index;
              const key = keyExtractor
                ? keyExtractor(item, actualIndex)
                : (getVirtualItemId(item) ?? actualIndex);
              return (
                <div key={key} className={itemClassName}>
                  {renderItem(item, actualIndex)}
                </div>
              );
            })}
          </div>
        ))}
      </WindowVirtualizer>

      {/* Infinite Scroll Trigger Sentinel */}
      <div
        ref={sentinelRef}
        className="flex flex-col items-center justify-center pt-12"
        style={{ overflowAnchor: "none" }} // Prevent browser from following the sentinel down
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
