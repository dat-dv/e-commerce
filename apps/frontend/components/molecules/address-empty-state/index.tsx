"use client";

import Button from "@/components/atoms/button";
import { MapPin } from "lucide-react";

interface AddressEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const AddressEmptyState = ({
  title = "No addresses yet",
  description = "Add a shipping address to get started.",
  actionLabel,
  onAction,
  className,
}: AddressEmptyStateProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-content/10 py-10 text-center ${
        className ?? ""
      }`}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-content/5">
        <MapPin size={24} className="text-content/30" aria-hidden />
      </div>
      <div>
        <p className="font-bold text-content">{title}</p>
        <p className="mt-1 text-sm text-content/50">{description}</p>
      </div>
      {onAction && actionLabel && (
        <Button
          type="button"
          onClick={onAction}
          className="mt-2 text-[12px] font-black uppercase"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default AddressEmptyState;
