import React from "react";
import { motion } from "framer-motion";
import { Package, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { ICartItem } from "@/domain/cart/types/cart.model";

interface OrderItemsSectionProps {
  items: ICartItem[];
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
            <div className="flex-1">
              <h4 className="font-bold text-sm line-clamp-1 mb-1">
                {item.name}
              </h4>
              <div className="text-[10px] uppercase tracking-widest text-content/30 italic font-light mb-4">
                {item.attributes || "Standard Edition"}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-content/[0.03] rounded-full">
                  Qty: {item.quantity}
                </div>
                <div className="text-lg font-black text-content tracking-tighter">
                  ${(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
