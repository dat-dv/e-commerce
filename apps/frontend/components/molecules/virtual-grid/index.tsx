"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useInView, UseInViewOptions } from "framer-motion";
import { WindowVirtualizer } from "virtua";
import { useTranslations } from "next-intl";
import {
  PRODUCT_LISTING_GRID_CLASS_NAME,
  PRODUCT_LISTING_GRID_COLUMNS,
} from "./grid-presets";

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

export interface VirtualGridColumns {
  base: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

// Helper hook to dynamically resolve columns based on responsive config and window width
function useResponsiveColumns(columns: VirtualGridColumns): number {
  const [cols, setCols] = useState(columns.base);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const getColsFromConfig = () => {
      const width = window.innerWidth;

      if (width >= 1280 && columns.xl !== undefined) {
        return columns.xl;
      }
      if (width >= 1024 && columns.lg !== undefined) {
        return columns.lg;
      }
      if (width >= 768 && columns.md !== undefined) {
        return columns.md;
      }
      if (width >= 640 && columns.sm !== undefined) {
        return columns.sm;
      }
      return columns.base;
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCols(getColsFromConfig());

    const handleResize = () => {
      setCols(getColsFromConfig());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [columns]);

  return cols;
}

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
  rowClassName?: string;
  triggerMargin?: UseInViewOptions["margin"];
  columns?: VirtualGridColumns;
}

export function VirtualGrid<T>({
  data,
  renderItem,
  keyExtractor,
  loadingMore,
  hasMore,
  onLoadMore,
  loadingText,
  endText,
  gridClassName = PRODUCT_LISTING_GRID_CLASS_NAME,
  itemClassName = "",
  rowClassName = "pb-6 last:pb-0",
  triggerMargin = "200px", // Reduced margin to avoid double-triggering in grids
  columns = PRODUCT_LISTING_GRID_COLUMNS,
}: VirtualGridProps<T>) {
  const t = useTranslations("Common.virtualized");
  const displayLoadingText = loadingText ?? t("loadingMore");
  const displayEndText = endText ?? t("allItemsLoaded");
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sentinelRef, {
    margin: triggerMargin,
  });

  const itemsPerRow = useResponsiveColumns(columns);

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
    for (let i = 0; i < data.length; i += itemsPerRow) {
      rows.push(data.slice(i, i + itemsPerRow));
    }
    return rows;
  }, [data, itemsPerRow]);

  return (
    <div className="flex flex-col">
      <WindowVirtualizer>
        {rows.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className={`mb-4 ${gridClassName} ${rowClassName}`}
          >
            {row.map((item, index) => {
              const actualIndex = rowIndex * itemsPerRow + index;
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
              {displayLoadingText}
            </span>
          </div>
        ) : hasMore ? (
          <div className="h-12" />
        ) : data.length > 0 && displayEndText ? (
          <div className="py-6 flex items-center gap-4 w-full px-4">
            <div className="h-px flex-1 bg-content/[0.05]" />

            <span className="text-sm font-medium text-content/40 whitespace-nowrap">
              {displayEndText}
            </span>

            <div className="h-px flex-1 bg-content/[0.05]" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
