import { AdminThumbnail } from "@/components/atoms/admin-thumbnail";
import type { IAdminCustomerOrder } from "@/domain/user/types/user.model";

import { formatCurrency } from "../../products-view/product.utils";

export interface OrdersTableExpandedRowProps {
  order: IAdminCustomerOrder;
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
          {formatCurrency(Number(order.totalAmount))}
        </p>
      </div>

      <div className="divide-content/5 divide-y overflow-hidden rounded-lg border border-[var(--border-color)]/70 bg-[var(--app-bg)]/30">
        {orderItems.map((item) => {
          const sku = item.sku;
          const product = sku?.product;
          const productName = product?.translations?.[0]?.name ?? "-";
          const imageUrl = sku?.imageUrl ?? product?.thumbnail?.url;
          const skuCode = sku?.skuCode ?? item.skuId;
          const attributes = sku?.skuAttributeValues
            ?.map((entry) => entry.attributeValue?.value)
            .filter(Boolean)
            .join(" | ");
          const unitPrice = Number(item.price);

          return (
            <div
              key={item.id}
              className="grid gap-3 p-3 sm:grid-cols-[minmax(0,1fr)_88px_120px]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <AdminThumbnail
                  src={imageUrl}
                  alt={productName}
                  containerClassName="relative bg-content/5 flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg"
                />

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--app-text)]">
                    {productName}
                  </p>
                  <p className="text-primary truncate font-mono text-xs">
                    {skuCode}
                  </p>
                  {attributes && (
                    <p className="truncate text-xs text-[var(--muted)]">
                      {attributes}
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
                  {formatCurrency(unitPrice)}
                </p>
                <p className="font-semibold text-[var(--app-text)]">
                  {formatCurrency(unitPrice * item.quantity)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
