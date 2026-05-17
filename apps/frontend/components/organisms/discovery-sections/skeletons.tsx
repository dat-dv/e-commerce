"use client";

import React from "react";
import { Eye, Sparkles } from "lucide-react";

export const RecentViewedSectionSkeleton = () => {
  return (
    <div className="w-full py-6">
      <div className="mb-6 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-content/20">
          <Eye size={16} />
          <div className="h-3 w-16 rounded bg-content/5 animate-pulse" />
        </div>
        <div className="h-7 w-48 rounded bg-content/5 animate-pulse" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="aspect-[3/4] rounded-3xl border border-content/[0.04] bg-content/[0.02] p-4 flex flex-col justify-end gap-3"
          >
            <div className="h-4 bg-content/5 rounded-full w-3/4 animate-pulse" />
            <div className="h-3 bg-content/5 rounded-full w-1/2 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const RecommendedSectionSkeleton = () => {
  return (
    <div className="w-full py-6">
      <div className="mb-6 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-content/20">
          <Sparkles size={16} />
          <div className="h-3 w-20 rounded bg-content/5 animate-pulse" />
        </div>
        <div className="h-7 w-60 rounded bg-content/5 animate-pulse" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="aspect-[3/4] rounded-3xl border border-content/[0.04] bg-content/[0.02] p-4 flex flex-col justify-end gap-3"
          >
            <div className="h-4 bg-content/5 rounded-full w-3/4 animate-pulse" />
            <div className="h-3 bg-content/5 rounded-full w-1/2 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};
