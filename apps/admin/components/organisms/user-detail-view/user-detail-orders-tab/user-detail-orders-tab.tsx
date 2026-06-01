"use client";

import { Package } from "lucide-react";

import { EmptyTabState } from "@/components/molecules/empty-tab-state";
import { formatAdminDate } from "@/components/organisms/user-detail-view/user-detail-view.utils";
import { useUserDetailOrders } from "@/hooks/user/use-user-detail-orders";

import { formatCurrency, getOrderStatus } from "../../orders-view/order.utils";

export const UserDetailOrdersTab = ({ userId }: { userId: string }) => {
  const { orders, loading } = useUserDetailOrders(userId);

  if (loading) {
    return (
      <div className="p-8 text-center text-[var(--muted)]">
        Loading orders...
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-content text-lg font-bold">Orders</h2>
          <p className="text-content/50 mt-1 text-sm">
            Showing the latest {orders.items.length} of {orders.meta.total}{" "}
            orders for this customer.
          </p>
        </div>
      </div>

      {orders.items.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-[var(--border-color)]">
          <div className="min-w-[680px]">
            <div className="grid grid-cols-[1fr_150px_140px_160px] gap-4 bg-[var(--app-bg)]/40 px-4 py-3 text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
              <span>Order</span>
              <span>Status</span>
              <span>Total</span>
              <span>Date</span>
            </div>
            <div className="divide-y divide-[var(--border-color)]">
              {orders.items.map((order) => {
                const status = getOrderStatus(order.status);

                return (
                  <div
                    key={order.id}
                    className="grid grid-cols-[1fr_150px_140px_160px] gap-4 px-4 py-3 text-sm"
                  >
                    <code className="text-primary font-semibold">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </code>
                    <span
                      className={`w-fit rounded-md px-2 py-0.5 text-xs font-semibold ${status.color}`}
                    >
                      {status.label}
                    </span>
                    <span className="text-content font-semibold">
                      {formatCurrency(order.total_amount)}
                    </span>
                    <span className="text-content/55">
                      {formatAdminDate(order.created_at)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <EmptyTabState
          icon={Package}
          title="No orders yet"
          description="This customer has no order history."
        />
      )}
    </section>
  );
};
