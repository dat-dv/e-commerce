"use client";

import { ShoppingCart } from "lucide-react";

import { EmptyTabState } from "@/components/molecules/empty-tab-state";
import { formatCurrency } from "@/components/organisms/products-view/product.utils";
import { useUserDetailCart } from "@/hooks/user/use-user-detail-cart";

export const UserDetailCartTab = ({ userId }: { userId: string }) => {
  const { cart, loading } = useUserDetailCart(userId);

  if (loading) {
    return (
      <div className="p-8 text-center text-[var(--muted)]">Loading cart...</div>
    );
  }

  return (
    <section className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-content text-lg font-bold">Cart</h2>
          <p className="text-content/50 mt-1 text-sm">
            {cart.totalItems} items · {formatCurrency(cart.subtotal)}
          </p>
        </div>
      </div>

      {cart.items.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-[var(--border-color)]">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-[1fr_120px_120px_140px] gap-4 bg-[var(--app-bg)]/40 px-4 py-3 text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
              <span>Product</span>
              <span>SKU</span>
              <span className="text-right">Quantity</span>
              <span className="text-right">Line total</span>
            </div>
            <div className="divide-y divide-[var(--border-color)]">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1fr_120px_120px_140px] gap-4 px-4 py-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="text-content truncate font-semibold">
                      {item.productName}
                    </p>
                    <p className="text-content/45 mt-0.5 truncate text-xs">
                      {item.productSlug || "No slug"}
                    </p>
                  </div>
                  <code className="text-primary text-xs font-semibold">
                    {item.skuCode}
                  </code>
                  <span className="text-content/70 text-right">
                    {item.quantity}
                  </span>
                  <span className="text-content text-right font-semibold">
                    {formatCurrency(item.quantity * item.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <EmptyTabState
          icon={ShoppingCart}
          title="Cart is empty"
          description="This customer does not have active cart items."
        />
      )}
    </section>
  );
};

UserDetailCartTab.displayName = "UserDetailCartTab";
