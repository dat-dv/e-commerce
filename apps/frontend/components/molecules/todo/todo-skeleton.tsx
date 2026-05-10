"use client";

import React from "react";

export const TodoSkeleton = () => {
  return (
    <div
      data-testid="todo-skeleton"
      className="space-y-4 animate-in fade-in duration-500"
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="w-full rounded-2xl bg-content/[0.03] border border-content/[0.05] flex items-center p-4 gap-4"
        >
          {/* Checkbox Placeholder */}
          <div className="h-10 w-10 rounded-full bg-content/[0.06] animate-pulse shrink-0" />

          {/* Content Placeholder */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-5 w-1/2 bg-content/[0.06] rounded-lg animate-pulse" />
          </div>

          {/* Delete Button Placeholder */}
          <div className="h-10 w-10 rounded-xl bg-content/[0.03] animate-pulse shrink-0" />
        </div>
      ))}
    </div>
  );
};
