import {
  Avatar,
  Button,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@ecommerce/ui";
import { Calendar } from "lucide-react";

import { AdminThumbnail } from "@/components/atoms/admin-thumbnail";
import {
  formatCurrency,
  formatDate,
  getOrderStatus,
} from "@/components/organisms/orders-view/order.utils";
import type { IAdminCustomerOrder } from "@/domain/user/types/user.model";

interface IOrderDetailDialogProps {
  order: IAdminCustomerOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailDialog = ({
  order,
  isOpen,
  onClose,
}: IOrderDetailDialogProps) => (
  <Dialog isOpen={isOpen} onClose={onClose}>
    <DialogPanel className="border-content/10 bg-surface/95 max-w-xl rounded-2xl border p-6 shadow-2xl backdrop-blur-2xl">
      <DialogTitle className="text-xl font-bold text-[var(--app-text)]">
        Order Details
      </DialogTitle>

      {order && (
        <div className="mt-6 space-y-5">
          {/* Order ID & Status */}
          <div className="border-content/5 bg-content/[0.02] flex items-center justify-between rounded-xl border px-4 py-3">
            <div>
              <p className="text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                Order ID
              </p>
              <code className="text-primary text-sm font-bold">
                #{order.id.toUpperCase()}
              </code>
            </div>
            <span
              className={`rounded-md px-3 py-1 text-xs font-semibold ${getOrderStatus(order.status).color}`}
            >
              {getOrderStatus(order.status).label}
            </span>
          </div>

          {/* Customer */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
              Customer
            </p>
            <div className="border-content/5 bg-content/[0.02] flex items-center gap-3 rounded-xl border px-4 py-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                <Avatar
                  name={`${order.user?.firstName ?? ""} ${order.user?.lastName ?? ""}`}
                  size={40}
                />
              </div>
              <div>
                <p className="font-semibold text-[var(--app-text)]">
                  {[order.user?.firstName, order.user?.lastName]
                    .filter(Boolean)
                    .join(" ") || "Unknown"}
                </p>
                <p className="text-xs text-[var(--muted)]">
                  {order.user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Financials */}
          <div className="grid grid-cols-2 gap-3">
            <div className="border-content/5 bg-content/[0.02] rounded-xl border px-4 py-3">
              <p className="text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                Total Amount
              </p>
              <p className="mt-1 text-base font-bold text-emerald-400">
                {formatCurrency(Number(order.totalAmount))}
              </p>
            </div>
            <div className="border-content/5 bg-content/[0.02] rounded-xl border px-4 py-3">
              <p className="text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                Discount
              </p>
              <p className="mt-1 text-base font-bold text-orange-400">
                {formatCurrency(Number(order.discountAmount ?? 0))}
              </p>
            </div>
          </div>

          {/* Order Items */}
          {order.items && order.items.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                Items ({order.items.length})
              </p>
              <div className="border-content/5 bg-content/[0.02] divide-content/5 divide-y overflow-hidden rounded-xl border">
                {order.items.map((item) => {
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
                      className="grid gap-3 p-3 sm:grid-cols-[minmax(0,1fr)_84px_112px]"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <AdminThumbnail
                          src={imageUrl}
                          alt={productName}
                          containerClassName="relative bg-content/5 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg"
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
                        <p className="text-[var(--muted)]">Qty</p>
                        <p className="font-semibold text-[var(--app-text)]">
                          {item.quantity}
                        </p>
                      </div>

                      <div className="text-sm sm:text-right">
                        <p className="text-[var(--muted)]">
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
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="border-content/5 bg-content/[0.02] flex items-center gap-2 rounded-xl border px-4 py-3">
              <Calendar className="h-4 w-4 shrink-0 text-[var(--muted)]" />
              <div>
                <p className="text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                  Placed
                </p>
                <p className="text-xs text-[var(--app-text)]">
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
            <div className="border-content/5 bg-content/[0.02] flex items-center gap-2 rounded-xl border px-4 py-3">
              <Calendar className="h-4 w-4 shrink-0 text-[var(--muted)]" />
              <div>
                <p className="text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                  Updated
                </p>
                <p className="text-xs text-[var(--app-text)]">
                  {formatDate(order.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Close */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={onClose}
              className="bg-primary shadow-primary/10 hover:bg-primary rounded-lg px-6 py-2.5 font-bold text-white shadow-lg"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </DialogPanel>
  </Dialog>
);

OrderDetailDialog.displayName = "OrderDetailDialog";
