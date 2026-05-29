"use client";

import { Button } from "@ecommerce/ui";
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
        "border-content/10 flex flex-col items-center justify-center gap-3 border-2 border-dashed py-10 text-center",
        className,
      )}
    >
      <div className="bg-content/5 flex size-14 items-center justify-center rounded-full">
        <MapPin size={24} className="text-content/30" aria-hidden />
      </div>
      <div>
        <p className="text-content font-bold">{displayTitle}</p>
        <p className="text-content/50 mt-1 text-sm">{displayDescription}</p>
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
