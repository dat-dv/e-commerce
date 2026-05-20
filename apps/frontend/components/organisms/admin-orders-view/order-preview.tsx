"use client";

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
        className="size-12 rounded-md border border-content/10 object-cover"
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-content">
          {preview.name}
        </p>
        <p className="truncate text-xs text-content/50">
          {preview.attributes || t("showItems", { count: preview.quantity })}
          {preview.extraCount > 0 && ` +${preview.extraCount}`}
        </p>
      </div>
    </div>
  );
}
