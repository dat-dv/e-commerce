"use client";

import Button from "@/components/atoms/button";
import { TYPOGRAPHY } from "@/constants/typography";
import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

interface AddressEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const AddressEmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  className,
}: AddressEmptyStateProps) => {
  const t = useTranslations("Common.addressEmptyState");
  const displayTitle = title ?? t("title");
  const displayDescription = description ?? t("description");

  return (
    <div
      className={cn(
        UI_RADIUS.panel,
        "flex flex-col items-center justify-center gap-3 border-2 border-dashed border-content/10 py-10 text-center",
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-content/5">
        <MapPin size={24} className="text-content/30" aria-hidden />
      </div>
      <div>
        <p className="font-bold text-content">{displayTitle}</p>
        <p className="mt-1 text-sm text-content/50">{displayDescription}</p>
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

export default AddressEmptyState;
