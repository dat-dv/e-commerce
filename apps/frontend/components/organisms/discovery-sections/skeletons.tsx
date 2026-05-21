"use client";

import { PRODUCT_LISTING_GRID_CLASS_NAME } from "@/components/molecules/virtual-grid/grid-presets";
import { Eye } from "lucide-react";

interface DiscoverySectionSkeletonProps {
  loading: boolean;
  total: number;
  children: React.ReactNode;
}
export const DiscoverySectionSkeleton = ({
  total,
  loading,
  children,
}: DiscoverySectionSkeletonProps) => {
  if (!loading && !total) return null;
  if (total) return children;

  return (
    <div className="w-full py-6">
      <div className="mb-6 flex flex-col gap-2">
        <div className="text-content/20 flex items-center gap-2">
          <Eye size={16} />
          <div className="bg-content/5 h-3 w-16 animate-pulse rounded" />
        </div>
        <div className="bg-content/5 h-7 w-48 animate-pulse rounded" />
      </div>
      <div className={PRODUCT_LISTING_GRID_CLASS_NAME}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="border-content/[0.04] bg-content/[0.02] flex aspect-[3/4] flex-col justify-end gap-3 rounded-3xl border p-4"
          >
            <div className="bg-content/5 h-4 w-3/4 animate-pulse rounded-full" />
            <div className="bg-content/5 h-3 w-1/2 animate-pulse rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};
