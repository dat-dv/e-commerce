import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/utils/cn";

interface OrderSummaryProps {
  totalAmount: number;
  onPlaceOrder: () => void;
  loading: boolean;
  isItemsEmpty: boolean;
}

export const OrderSummary = ({
  totalAmount,
  onPlaceOrder,
  loading,
  isItemsEmpty,
}: OrderSummaryProps) => {
  return (
    <div className="lg:col-span-4 sticky top-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-[2.5rem] bg-surface border border-content/5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/[0.02] blur-[60px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10 opacity-40">
            <ShoppingBag size={16} className="text-content" />
            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-content">
              Final Summary
            </span>
          </div>

          <div className="space-y-6 mb-12">
            <div className="flex justify-between text-[11px] uppercase tracking-widest text-content/40">
              <span>Subtotal</span>
              <span className="text-content font-bold">
                ${totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-[11px] uppercase tracking-widest text-content/40">
              <span>Shipping Fee</span>
              <span className="text-green-600 font-bold">FREE</span>
            </div>
            <div className="flex justify-between text-[11px] uppercase tracking-widest text-content/40">
              <span>Tax (Included)</span>
              <span className="text-content font-bold">$0.00</span>
            </div>

            <div className="h-px bg-content/5 my-8" />

            <div className="flex justify-between items-end">
              <div className="flex flex-col text-content">
                <span className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-1">
                  Grand Total
                </span>
                <span className="text-4xl font-black tracking-tighter">
                  ${totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onPlaceOrder}
            disabled={loading || isItemsEmpty}
            className={cn(
              "w-full py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] transition-all relative overflow-hidden",
              loading || isItemsEmpty
                ? "bg-content/5 text-content/20 cursor-not-allowed"
                : "bg-content text-surface hover:bg-primary transition-colors shadow-2xl shadow-content/10",
            )}
          >
            {loading ? "Processing Order..." : "Complete Purchase"}
          </motion.button>

          <div className="mt-8 text-center opacity-20 text-[8px] uppercase tracking-[0.3em] font-bold text-content">
            Antigravity Encryption Active
          </div>
        </div>
      </motion.div>
    </div>
  );
};
