import React from "react";
import { motion } from "framer-motion";
import { Package, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { TCartItem } from "@/store/cart-store/cart-store.type";
import { formatCurrency } from "@/utils/format-currency";

interface OrderItemsSectionProps {
  items: TCartItem[];
}

export const OrderItemsSection = ({ items }: OrderItemsSectionProps) => {
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
        {items.map((item) => (
          <motion.div
            key={item.sku_id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-[2rem] bg-surface/30 backdrop-blur-sm border border-content/5 flex items-center gap-6 group hover:bg-surface/50 transition-all"
          >
            <div className="relative w-24 h-28 rounded-xl overflow-hidden bg-content/[0.02] border border-content/5 flex-shrink-0">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-content/10">
                  <ShoppingBag size={24} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-4 mb-1">
                <h4 className="font-bold text-base text-content line-clamp-1 group-hover:text-primary transition-colors">
                  {item.name}
                </h4>
                <div className="text-lg font-black text-content tracking-tighter shrink-0">
                  {formatCurrency(item.price * item.quantity)}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-content/30 italic">
                  {item.attributes || "Standard Edition"}
                </span>
                {item.original_price && item.original_price > item.price && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md uppercase tracking-widest">
                      -
                      {Math.round((1 - item.price / item.original_price) * 100)}
                      % OFF
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-content/[0.03] rounded-lg border border-content/5">
                  <span className="text-[9px] font-bold text-content/40 uppercase tracking-widest">
                    Qty
                  </span>
                  <span className="text-xs font-black">{item.quantity}</span>
                </div>

                <div className="h-4 w-[1px] bg-content/10" />

                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-content/40 uppercase tracking-widest">
                        Unit Price
                      </span>
                      <span className="text-xs font-bold text-primary">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                    {item.original_price &&
                      item.original_price > item.price && (
                        <span className="text-[10px] text-content/20 line-through font-medium ml-12">
                          {formatCurrency(item.original_price)}
                        </span>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
