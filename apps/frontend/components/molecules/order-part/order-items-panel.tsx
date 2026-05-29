"use client";

import { UI_RADIUS } from "@/constants/ui-radius";
import { TOrderItem } from "@/domain/orders/types/order.model";
import { cn } from "@/utils/cn";
import { ImagePreview } from "@ecommerce/ui";
import Image from "next/image";

import { useLocale, useTranslations } from "next-intl";
import { parseOrderAttributes } from "./order-display.utils";

export const getOrderItemDisplay = (
  item: TOrderItem,
  fallbackProductName = "Product",
) => {
  const sku = item.snapshot?.sku;
  const snapshotProduct = sku?.product;
  const domainProduct = item.sku?.product;
  const unitPrice = sku?.price ?? item.price;

  return {
    attributes: parseOrderAttributes(sku?.attributes || item.attributes),
    image:
      sku?.image_url ||
      snapshotProduct?.thumbnail_url ||
      domainProduct?.thumbnailUrl ||
      item.sku?.imageUrl ||
      "/images/placeholder.png",
    name: snapshotProduct?.name || domainProduct?.name || fallbackProductName,
    skuCode: sku?.sku_code || item.sku?.skuCode || item.skuId,
    subtotal: unitPrice * item.quantity,
    unitPrice,
  };
};

interface OrderItemsPanelProps {
  compact?: boolean;
  items: TOrderItem[];
}

export function OrderItemsPanel({
  compact = false,
  items,
}: OrderItemsPanelProps) {
  const t = useTranslations("OrdersPage.detail");
  const locale = useLocale();
  const fallbackProductName = t("productFallback");

  if (items.length === 0) {
    return (
      <div
        className={cn(
          UI_RADIUS.panel,
          "border-content/10 bg-surface text-content/55 border px-4 py-3 text-sm",
        )}
      >
        {t("noOrderItems")}
      </div>
    );
  }

  return (
    <div className={cn(UI_RADIUS.panel, "border-content/10 bg-surface border")}>
      <div className="border-content/10 border-b px-4 py-3">
        <p className="text-content/45 text-xs font-semibold uppercase">
          {t("orderItemsHeader")}
        </p>
      </div>
      <div className={compact ? "divide-content/10 divide-y" : "grid"}>
        {items.map((item) => (
          <OrderItemRow
            key={item.id}
            item={item}
            compact={compact}
            locale={locale}
            t={t}
            fallbackProductName={fallbackProductName}
          />
        ))}
      </div>
    </div>
  );
}

interface OrderItemProductSummaryProps {
  imageSize?: number;
  item: TOrderItem;
}

export function OrderItemProductSummary({
  imageSize = 44,
  item,
}: OrderItemProductSummaryProps) {
  const t = useTranslations("OrdersPage.detail");
  const preview = getOrderItemDisplay(item, t("productFallback"));

  return (
    <div className="flex min-w-0 items-center gap-3">
      <ImagePreview
        src={preview.image}
        alt={preview.name}
        imageComponent={Image}
        triggerClassName={cn(
          UI_RADIUS.media,
          "size-11 shrink-0 border border-content/10",
        )}
        imageProps={{
          width: imageSize,
          height: imageSize,
          className: "size-full object-cover",
        }}
      />
      <div className="min-w-0">
        <p className="text-content truncate text-sm font-semibold">
          {preview.name}
        </p>
        <p className="text-content/45 truncate font-mono text-xs">
          {preview.skuCode}
        </p>
        {preview.attributes && (
          <p className="text-content/50 truncate text-xs">
            {preview.attributes}
          </p>
        )}
      </div>
    </div>
  );
}

function OrderItemRow({
  compact,
  item,
  locale,
  t,
  fallbackProductName,
}: {
  compact: boolean;
  item: TOrderItem;
  locale: string;
  t: ReturnType<typeof useTranslations>;
  fallbackProductName: string;
}) {
  const preview = getOrderItemDisplay(item, fallbackProductName);

  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

  const numberFormatter = new Intl.NumberFormat(locale);

  return (
    <div
      className={
        compact
          ? "grid gap-3 p-4"
          : "border-content/10 grid grid-cols-[minmax(18rem,1fr)_7rem_8rem_8rem] items-center gap-4 border-b p-4 last:border-b-0"
      }
    >
      <OrderItemProductSummary item={item} />

      <div className={compact ? "grid grid-cols-3 gap-3 text-sm" : "contents"}>
        <div>
          <p className="text-content/45 text-xs font-semibold uppercase">
            {t("qty")}
          </p>
          <p className="text-content mt-1 font-semibold tabular-nums">
            {numberFormatter.format(item.quantity)}
          </p>
        </div>
        <div>
          <p className="text-content/45 text-xs font-semibold uppercase">
            {t("unit")}
          </p>
          <p className="text-content mt-1 font-semibold tabular-nums">
            {currencyFormatter.format(preview.unitPrice)}
          </p>
        </div>
        <div>
          <p className="text-content/45 text-xs font-semibold uppercase">
            {t("subtotal")}
          </p>
          <p className="text-content mt-1 font-semibold tabular-nums">
            {currencyFormatter.format(preview.subtotal)}
          </p>
        </div>
      </div>
    </div>
  );
}
