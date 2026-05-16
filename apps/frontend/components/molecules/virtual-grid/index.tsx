"use client";

import { useEffect, useRef } from "react";
import { useInView, UseInViewOptions } from "framer-motion";
import { WindowVirtualizer } from "virtua";

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
  triggerMargin = "100px",
}: VirtualGridProps<T>) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sentinelRef, { margin: triggerMargin });

  useEffect(() => {
    if (isInView && hasMore && !loadingMore) {
      onLoadMore();
    }
  }, [isInView, hasMore, loadingMore, onLoadMore]);

  return (
    <div className="flex flex-col gap-12">
      <WindowVirtualizer>
        <div className={gridClassName}>
          {data.map((item, index) => {
            const key = keyExtractor
              ? keyExtractor(item, index)
              : ((item as unknown as { id: string | number })?.id ?? index);
            return (
              <div key={key} className={itemClassName}>
                {renderItem(item, index)}
              </div>
            );
          })}
        </div>
      </WindowVirtualizer>

      {/* Infinite Scroll Trigger Sentinel */}
      <div
        ref={sentinelRef}
        className="flex flex-col items-center justify-center py-12"
      >
        {loadingMore ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-primary/10 border-t-primary rounded-full animate-spin" />
            <span className="text-xs font-semibold text-content/30">
              {loadingText}
            </span>
          </div>
        ) : hasMore ? (
          <div className="h-20" />
        ) : data.length > 0 ? (
          <div className="flex items-center gap-4 text-content/10">
            <div className="h-[1px] w-12 bg-current" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {endText}
            </span>
            <div className="h-[1px] w-12 bg-current" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
