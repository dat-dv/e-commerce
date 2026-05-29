"use client";

import { UI_RADIUS } from "../../../tokens";
import { cn } from "../../../utils";

export const AddressLoadingCard = () => {
  return (
    <div
      className={cn(
        UI_RADIUS.panel,
        "border-content/[0.05] bg-surface/40 border p-5",
      )}
    >
      <div className="animate-pulse space-y-3">
        <div className="bg-content/[0.06] h-4 w-1/3 rounded" />
        <div className="bg-content/[0.05] h-3 w-2/3 rounded" />
        <div className="bg-content/[0.05] h-3 w-1/2 rounded" />
      </div>
    </div>
  );
};

AddressLoadingCard.displayName = "AddressLoadingCard";
