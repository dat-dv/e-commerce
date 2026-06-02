import type { IOrderResponse } from "@ecommerce/shared";
import { Package } from "lucide-react";

import { getOrderItemDisplay } from "@/components/organisms/orders-view/order.utils";

import { formatCurrency } from "../../products-view/product.utils";

export interface OrdersTableExpandedRowProps {
  order: IOrderResponse;
}

export const OrdersTableExpandedRow = ({
  order,
}: OrdersTableExpandedRowProps) => {
  const orderItems = order.items ?? [];

  return (
    <div className="border-content/5 bg-content/[0.012] border-t px-4 py-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs font-bold tracking-wider text-[var(--muted)] uppercase">
          Order items ({orderItems.length})
        </p>
        <p className="text-xs font-semibold text-[var(--app-text)]">
          {formatCurrency(order.total_amount)}
        </p>
      </div>

      <div className="divide-content/5 divide-y overflow-hidden rounded-lg border border-[var(--border-color)]/70 bg-[var(--app-bg)]/30">
        {orderItems.map((item) => {
          const preview = getOrderItemDisplay(item);

          return (
            <div
              key={item.id}
              className="grid gap-3 p-3 sm:grid-cols-[minmax(0,1fr)_88px_120px]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="bg-content/5 flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                  {preview.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preview.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package className="text-primary h-4 w-4" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--app-text)]">
                    {preview.name}
                  </p>
                  <p className="text-primary truncate font-mono text-xs">
                    {preview.skuCode}
                  </p>
                  {preview.attributes && (
                    <p className="truncate text-xs text-[var(--muted)]">
                      {preview.attributes}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-sm sm:text-right">
                <p className="text-xs text-[var(--muted)]">Qty</p>
                <p className="font-semibold text-[var(--app-text)]">
                  {item.quantity}
                </p>
              </div>

              <div className="text-sm sm:text-right">
                <p className="text-xs text-[var(--muted)]">
                  {formatCurrency(preview.unitPrice)}
                </p>
                <p className="font-semibold text-[var(--app-text)]">
                  {formatCurrency(preview.subtotal)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
