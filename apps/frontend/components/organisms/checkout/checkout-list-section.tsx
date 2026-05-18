import React from "react";
import { motion } from "framer-motion";
import { Package, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { TCartItem } from "@/store/cart-store/cart-store.type";
import { formatCurrency } from "@/utils/format-currency";
import EmptyState from "@/components/molecules/empty-space";
import { APP_ROUTES } from "@/constants/routes";

interface CheckoutListProps {
  items: TCartItem[];
}

export const CheckoutList = ({ items }: CheckoutListProps) => {
  if (items.length === 0) {
    return (
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 rounded-full bg-content text-surface flex items-center justify-center shadow-lg shadow-content/10">
            <Package size={20} />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight">
            Review Items
          </h2>
        </div>
        <EmptyState
          title="No items selected"
          description="Please return to your cart or explore our products catalog to select items for checkout."
          icon={ShoppingBag}
          actionLabel="Browse Products"
          actionHref={APP_ROUTES.RECENTLY_VIEWED}
          className="py-12"
        />
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 rounded-full bg-content text-surface flex items-center justify-center shadow-lg shadow-content/10">
          <Package size={20} />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight">
          Review Items
        </h2>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const originalPrice = item.originalPrice || 0;
          const itemTotal = item.price * item.quantity;
          const isDiscounted = originalPrice > item.price;
          const discountPercent = isDiscounted
            ? Math.round((1 - item.price / originalPrice) * 100)
            : 0;

          const displayPrice = formatCurrency(item.price);
          const displayOriginalPrice = formatCurrency(item.originalPrice);
          const displayTotal = formatCurrency(itemTotal);

          return (
            <motion.div
              key={item.skuId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-[2rem] bg-surface/40 backdrop-blur-md border border-content/[0.05] flex items-center gap-6 group hover:bg-surface/60 transition-all shadow-sm"
            >
              <div className="relative w-24 h-28 rounded-xl overflow-hidden bg-content/[0.02] border border-content/[0.08] flex-shrink-0">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-content/10">
                    <ShoppingBag size={24} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h4 className="font-bold text-sm text-content truncate">
                    {item.name}
                  </h4>
                  <div className="text-base font-black text-content tracking-tighter shrink-0">
                    {displayTotal}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-content/40">
                    <span>{item.attributes || "Standard"}</span>
                    <span className="w-1 h-1 rounded-full bg-content/20" />
                    <span className="text-content/60">
                      Qty: {item.quantity}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {isDiscounted && (
                      <span className="text-[10px] font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">
                        -{discountPercent}%
                      </span>
                    )}
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[11px] font-semibold text-content/60">
                        {displayPrice}
                      </span>
                      {isDiscounted && (
                        <span className="text-[10px] text-content/20 line-through">
                          {displayOriginalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
