"use client";

import Image from "next/image";

import { TOrderItem } from "@/domain/orders/types/order.model";

import { parseOrderAttributes } from "./order-display.utils";
import { useTranslations, useLocale } from "next-intl";

export const getOrderItemDisplay = (item: TOrderItem) => {
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
    name: snapshotProduct?.name || domainProduct?.name || "Product",
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

  if (items.length === 0) {
    return (
      <div className="rounded-md border border-content/10 bg-surface px-4 py-3 text-sm text-content/55">
        {t("noOrderItems")}
      </div>
    );
  }

  return (
    <div className="rounded-md border border-content/10 bg-surface">
      <div className="border-b border-content/10 px-4 py-3">
        <p className="text-xs font-semibold uppercase text-content/45">
          {t("orderItemsHeader")}
        </p>
      </div>
      <div className={compact ? "divide-y divide-content/10" : "grid"}>
        {items.map((item) => (
          <OrderItemRow
            key={item.id}
            item={item}
            compact={compact}
            locale={locale}
            t={t}
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
  const preview = getOrderItemDisplay(item);

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Image
        src={preview.image}
        alt={preview.name}
        width={imageSize}
        height={imageSize}
        className="size-11 rounded-md border border-content/10 object-cover"
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-content">
          {preview.name}
        </p>
        <p className="truncate font-mono text-xs text-content/45">
          {preview.skuCode}
        </p>
        {preview.attributes && (
          <p className="truncate text-xs text-content/50">
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
}: {
  compact: boolean;
  item: TOrderItem;
  locale: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const preview = getOrderItemDisplay(item);

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
          : "grid grid-cols-[minmax(18rem,1fr)_7rem_8rem_8rem] items-center gap-4 border-b border-content/10 p-4 last:border-b-0"
      }
    >
      <OrderItemProductSummary item={item} />

      <div className={compact ? "grid grid-cols-3 gap-3 text-sm" : "contents"}>
        <div>
          <p className="text-xs font-semibold uppercase text-content/45">
            {t("qty")}
          </p>
          <p className="mt-1 font-semibold tabular-nums text-content">
            {numberFormatter.format(item.quantity)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-content/45">
            {t("unit")}
          </p>
          <p className="mt-1 font-semibold tabular-nums text-content">
            {currencyFormatter.format(preview.unitPrice)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-content/45">
            {t("subtotal")}
          </p>
          <p className="mt-1 font-semibold tabular-nums text-content">
            {currencyFormatter.format(preview.subtotal)}
          </p>
        </div>
      </div>
    </div>
  );
}
