"use client";

import { useInView } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { WindowVirtualizer } from "virtua";

import { IVirtualGridColumns, IVirtualGridProps } from "./virtual-grid.types";

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

export function useResponsiveColumns(columns: IVirtualGridColumns): number {
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

    setCols(getColsFromConfig());

    const handleResize = () => {
      setCols(getColsFromConfig());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [columns]);

  return cols;
}

const DEFAULT_GRID_COLUMNS: IVirtualGridColumns = {
  base: 2,
  sm: 3,
  md: 4,
  lg: 5,
};

export const DEFAULT_GRID_CLASS_NAME =
  "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";

export function VirtualGrid<T>({
  data,
  renderItem,
  keyExtractor,
  loadingMore,
  hasMore,
  onLoadMore,
  loadingText = "Loading more...",
  endText = "All items loaded",
  gridClassName = DEFAULT_GRID_CLASS_NAME,
  itemClassName = "",
  rowClassName = "pb-6 last:pb-0",
  triggerMargin = "200px",
  columns = DEFAULT_GRID_COLUMNS,
}: IVirtualGridProps<T>) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sentinelRef, {
    margin: triggerMargin,
  });

  const itemsPerRow = useResponsiveColumns(columns);
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
          onLoadMore?.();
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
        ) : data.length > 0 && endText ? (
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

VirtualGrid.displayName = "VirtualGrid";
