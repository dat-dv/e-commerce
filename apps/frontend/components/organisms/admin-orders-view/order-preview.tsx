"use client";

import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { OrderPreviewData } from "./admin-orders.utils";

export function OrderPreview({ preview }: { preview: OrderPreviewData }) {
  const t = useTranslations("AdminOrdersPage.results");
  return (
    <div className="flex min-w-0 items-center gap-3 lg:min-w-72">
      <Image
        src={preview.image}
        alt={preview.name}
        width={48}
        height={48}
        className={cn(
          UI_RADIUS.media,
          "border-content/10 size-12 border object-cover",
        )}
      />
      <div className="min-w-0">
        <p className="text-content truncate text-sm font-semibold">
          {preview.name}
        </p>
        <p className="text-content/50 truncate text-xs">
          {preview.attributes || t("showItems", { count: preview.quantity })}
          {preview.extraCount > 0 && ` +${preview.extraCount}`}
        </p>
      </div>
    </div>
  );
}
