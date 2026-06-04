import { Package } from "lucide-react";

import { AdminThumbnail } from "@/components/atoms/admin-thumbnail";
import { formatCurrency } from "@/components/organisms/orders-view/order.utils";
import type { IAdminOrderItem } from "@/domain/user/types/user.model";

import {
  getItemAttributes,
  getItemImage,
  getItemName,
} from "./order-detail.utils";

export const ItemsSection = ({ items }: { items?: IAdminOrderItem[] }) => (
  <div className="border-t border-[var(--border-color)] p-5">
    <div className="mb-4 flex items-center gap-2">
      <Package className="text-primary h-4 w-4" />
      <h2 className="text-lg font-semibold text-[var(--app-text)]">Items</h2>
    </div>
    <div className="divide-y divide-[var(--border-color)]">
      {items?.map((item) => (
        <div
          key={item.id}
          className="grid gap-4 py-4 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_120px]"
        >
          <div className="flex min-w-0 gap-3">
            <AdminThumbnail
              src={getItemImage(item) ?? undefined}
              alt={getItemName(item)}
              containerClassName="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/5 bg-white/5"
            />
            <div className="min-w-0">
              <p className="truncate font-semibold text-[var(--app-text)]">
                {getItemName(item)}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                SKU: {item.sku?.skuCode ?? item.skuId}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {getItemAttributes(item)}
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="font-semibold text-[var(--app-text)]">
              {formatCurrency(Number(item.price))}
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Qty {item.quantity}
            </p>
            <p className="mt-1 text-sm text-[var(--app-text)]">
              {formatCurrency(Number(item.price) * item.quantity)}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
