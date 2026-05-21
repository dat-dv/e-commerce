"use client";

import Button from "@/components/atoms/button";
import LiquidWaveText from "@/components/atoms/liquid-wave-text";
import { ORDER_STATUS_CONFIG } from "@/constants/order-status.constant";
import { UI_RADIUS } from "@/constants/ui-radius";
import { TOrder } from "@/domain/orders/types/order.model";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/format-currency";
import { EOrderStatus } from "@ecommerce/shared";
import type { HTMLMotionProps } from "framer-motion";
import { motion } from "framer-motion";
import { MessageSquare, RotateCcw, Store, Truck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

import { APP_ROUTES } from "@/constants/routes";
import Link from "next/link";

interface OrderCardProps extends HTMLMotionProps<"div"> {
  order: TOrder;
  headerClassName?: string;
  headerInfoClassName?: string;
  headerStatusClassName?: string;
  itemClassName?: string;
  itemImageClassName?: string;
  itemTitleClassName?: string;
  footerClassName?: string;
  totalClassName?: string;
  footerActionsClassName?: string;
  actionButtonClassName?: string;
  onCancelOrder?: (id: string) => void;
  onRequestReturn?: (id: string) => void;
}

export const OrderCard = ({
  order,
  className,
  headerClassName,
  headerInfoClassName,
  headerStatusClassName,
  itemClassName,
  itemImageClassName,
  itemTitleClassName,
  footerClassName,
  totalClassName,
  footerActionsClassName,
  actionButtonClassName,
  onCancelOrder,
  onRequestReturn,
  ...props
}: OrderCardProps) => {
  const t = useTranslations("OrdersPage");
  const tStatus = useTranslations("OrderStatus");
  const locale = useLocale();

  const getStatusLabel = (status: EOrderStatus) => {
    switch (status) {
      case EOrderStatus.PENDING:
        return tStatus("pending");
      case EOrderStatus.PAID:
        return tStatus("paid");
      case EOrderStatus.SHIPPING:
        return tStatus("shipping");
      case EOrderStatus.DELIVERED:
        return tStatus("delivered");
      case EOrderStatus.CANCEL_REQUESTED:
        return tStatus("cancelRequested");
      case EOrderStatus.CANCEL_PROCESSING:
        return tStatus("cancelProcessing");
      case EOrderStatus.CANCELLED:
        return tStatus("cancelled");
      case EOrderStatus.RETURN_REQUESTED:
        return tStatus("returnRequested");
      case EOrderStatus.RETURN_PROCESSING:
        return tStatus("returnProcessing");
      case EOrderStatus.RETURNED:
        return tStatus("returned");
      case EOrderStatus.RETURN_REJECTED:
        return tStatus("returnRejected");
      default:
        return status;
    }
  };

  const statusColor =
    ORDER_STATUS_CONFIG[order.status]?.color || "text-content/40 bg-content/5";
  const statusLabel = getStatusLabel(order.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "border-content/[0.05] bg-surface/40 hover:border-primary/20 overflow-hidden border shadow-sm backdrop-blur-md transition-all duration-300",
        UI_RADIUS.panel,
        className,
      )}
      {...props}
    >
      {/* Header */}
      <div
        className={cn(
          "border-content/[0.05] bg-content/[0.02] flex items-center justify-between gap-4 border-b px-5 py-4",
          headerClassName,
        )}
      >
        <div
          className={cn("flex min-w-0 items-center gap-4", headerInfoClassName)}
        >
          <div className="flex min-w-0 flex-col">
            <Link
              href={APP_ROUTES.ORDER_DETAIL(order.id)}
              className="text-content hover:text-primary truncate text-sm font-bold transition-all"
            >
              {t("card.orderNumber", { id: order.id.slice(-8).toUpperCase() })}
            </Link>
            <span className="text-content/40 text-xs font-medium">
              {new Date(order.createdAt).toLocaleDateString(locale, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <Button
            variant="ghost"
            disabled
            className="border-content/[0.05] bg-content/[0.03] text-content/40 hidden h-auto items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium active:scale-100 sm:flex"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            {t("card.needHelp")}
          </Button>
        </div>
        <div
          className={cn(
            "flex min-w-0 items-center justify-end gap-4",
            headerStatusClassName,
          )}
        >
          {order.status === EOrderStatus.SHIPPING && (
            <div className="border-content/[0.05] text-primary hidden items-center gap-2 border-r pr-4 text-xs font-semibold sm:flex">
              <Truck className="h-4 w-4" />
              <span>{t("card.shipping")}</span>
            </div>
          )}
          <span
            className={cn(
              "min-w-0 rounded-full px-3 py-1 text-[11px] font-bold",
              statusColor,
            )}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="divide-content/[0.05] divide-y">
        {order.items.map((item) => {
          const productSlug = item.sku?.product?.slug;
          const itemContent = (
            <div
              className={cn(
                "hover:bg-content/[0.02] flex gap-5 p-5 transition-colors",
                itemClassName,
              )}
            >
              <div
                className={cn(
                  "border-content/[0.05] bg-content/[0.02] relative size-20 flex-shrink-0 overflow-hidden border",
                  UI_RADIUS.media,
                  itemImageClassName,
                )}
              >
                {item.sku?.imageUrl ? (
                  <Image
                    src={item.sku.imageUrl}
                    alt={item.sku.product?.name || t("card.productFallback")}
                    fill
                    sizes="80px"
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                ) : (
                  <div className="text-content/10 flex h-full w-full items-center justify-center">
                    <Store className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <h3
                    className={cn(
                      "text-content line-clamp-1 text-sm leading-tight font-bold",
                      itemTitleClassName,
                    )}
                  >
                    <LiquidWaveText inactiveClassName="text-content">
                      {item.sku?.product?.name || t("card.productNameFallback")}
                    </LiquidWaveText>
                  </h3>
                  <div className="text-content shrink-0 text-sm font-bold tracking-tight sm:text-base">
                    {formatCurrency(item.price)}
                  </div>
                </div>
                <p className="text-content/40 mt-1 line-clamp-1 text-xs font-medium">
                  {item.attributes ||
                    t("card.skuCode", {
                      code: item.sku?.skuCode || t("card.defaultSku"),
                    })}
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="bg-content/[0.05] text-content/50 rounded-full px-2 py-0.5 text-[11px] font-semibold">
                    {t("card.units", { count: item.quantity })}
                  </div>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-content/30 text-xs line-through">
                      {formatCurrency(item.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );

          return productSlug ? (
            <Link
              key={item.id}
              href={APP_ROUTES.PRODUCT_DETAIL(productSlug)}
              className="group block"
            >
              {itemContent}
            </Link>
          ) : (
            <div key={item.id}>{itemContent}</div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        className={cn(
          "border-content/[0.05] bg-content/[0.01] border-t px-5 py-5",
          footerClassName,
        )}
      >
        <div className="flex flex-col items-end gap-4">
          <div className="flex flex-col items-end gap-1">
            {order.discountAmount > 0 && (
              <div className="flex items-center gap-2 text-xs font-medium">
                <span className="text-content/30">{t("card.discount")}</span>
                <span className="text-red-500">
                  -{formatCurrency(order.discountAmount)}
                </span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <span className="text-content/40 text-sm font-medium">
                {t("card.total")}
              </span>
              <span
                className={cn(
                  "text-content text-3xl font-black tracking-tight",
                  totalClassName,
                )}
              >
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>

          <div
            className={cn(
              "flex w-full flex-wrap justify-end gap-3",
              footerActionsClassName,
            )}
          >
            {order.status === EOrderStatus.PENDING && (
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  onCancelOrder?.(order.id);
                }}
                className={cn(
                  "h-auto border-red-500/20 px-6 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-500/10",
                  UI_RADIUS.control,
                  actionButtonClassName,
                )}
              >
                {t("card.cancel")}
              </Button>
            )}
            {order.status === EOrderStatus.DELIVERED && (
              <>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    onRequestReturn?.(order.id);
                  }}
                  className={cn(
                    "border-content/[0.1] text-content hover:bg-content/[0.05] flex h-auto items-center gap-2 px-5 py-2.5 text-sm font-semibold",
                    UI_RADIUS.control,
                    actionButtonClassName,
                  )}
                >
                  <RotateCcw className="h-4 w-4" />
                  {t("card.requestReturn")}
                </Button>
                <Button
                  className={cn(
                    "bg-content text-surface hover:bg-primary h-auto px-6 py-2.5 text-sm font-semibold",
                    UI_RADIUS.control,
                    actionButtonClassName,
                  )}
                >
                  {t("card.review")}
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    "border-content/[0.1] text-content/60 hover:bg-content/[0.05] h-auto px-6 py-2.5 text-sm font-semibold",
                    UI_RADIUS.control,
                    actionButtonClassName,
                  )}
                >
                  {t("card.reorder")}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
