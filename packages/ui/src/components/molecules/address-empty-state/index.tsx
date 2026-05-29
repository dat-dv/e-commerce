"use client";

import { MapPin } from "lucide-react";

import { TYPOGRAPHY, UI_RADIUS } from "../../../tokens";
import { cn } from "../../../utils";
import Button from "../../atoms/button";

export type { IAddressEmptyStateProps } from "./address-empty-state.types";

interface AddressEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const AddressEmptyState = ({
  title = "No Address Found",
  description = "Please add an address to continue.",
  actionLabel,
  onAction,
  className,
}: AddressEmptyStateProps) => {
  return (
    <div
      className={cn(
        UI_RADIUS.panel,
        "border-content/10 flex flex-col items-center justify-center gap-3 border-2 border-dashed py-10 text-center",
        className,
      )}
    >
      <div className="bg-content/5 flex size-14 items-center justify-center rounded-full">
        <MapPin size={24} className="text-content/30" aria-hidden />
      </div>
      <div>
        <p className="text-content font-bold">{title}</p>
        <p className="text-content/50 mt-1 text-sm">{description}</p>
      </div>
      {onAction && actionLabel && (
        <Button
          type="button"
          onClick={onAction}
          className={`mt-2 ${TYPOGRAPHY.caption} font-black uppercase`}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

AddressEmptyState.displayName = "AddressEmptyState";

export default AddressEmptyState;
