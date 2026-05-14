import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/button";

interface OrderSummaryProps {
  totalAmount: number;
  onPlaceOrder: () => void;
  loading: boolean;
  isItemsEmpty: boolean;
  recipientName?: string;
  recipientPhone?: string;
}

export const OrderSummary = ({
  totalAmount,
  onPlaceOrder,
  loading,
  isItemsEmpty,
  recipientName,
  recipientPhone,
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
          <div className="flex items-center gap-2 mb-8 opacity-60">
            <ShoppingBag size={14} className="text-content" />
            <span className="text-sm font-semibold text-content capitalize">
              Order Summary
            </span>
          </div>

          {/* Recipient Summary */}
          {recipientName && (
            <div className="mb-8 pb-6 border-b border-content/5">
              <div className="text-[10px] font-bold text-content/30 uppercase tracking-wider mb-2">
                Shipping To
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="font-bold text-sm text-content capitalize">
                  {recipientName}
                </div>
                <div className="text-xs text-content/60">{recipientPhone}</div>
              </div>
            </div>
          )}

          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-sm text-content/60">
              <span className="capitalize">Subtotal</span>
              <span className="text-content font-medium">
                ${totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm text-content/60">
              <span className="capitalize">Shipping fee</span>
              <span className="text-green-600 font-medium tracking-wide">
                FREE
              </span>
            </div>
            <div className="flex justify-between text-sm text-content/60">
              <span className="capitalize">Tax (included)</span>
              <span className="text-content font-medium">$0.00</span>
            </div>

            <div className="h-px bg-content/5 my-6" />

            {/* Integrated Payment Method */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3 opacity-60">
                <span className="text-xs font-semibold text-content capitalize">
                  Payment method
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-content/[0.03] border border-content/5 flex items-center gap-4">
                <div className="w-10 h-6 bg-content/5 rounded flex items-center justify-center border border-content/10">
                  <div className="w-4 h-4 rounded-full bg-primary/20 shrink-0" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-content">
                    Cash on Delivery
                  </div>
                  <div className="text-xs text-content/40 mt-0.5">
                    Pay on receipt
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div className="flex flex-col text-content">
                <span className="text-xs font-semibold text-content capitalize mb-1">
                  Grand Total
                </span>
                <span className="text-4xl font-black tracking-tighter">
                  ${totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={onPlaceOrder}
            disabled={loading || isItemsEmpty}
            loading={loading}
            className={cn(
              "w-full py-7 rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] transition-all relative overflow-hidden",
              loading || isItemsEmpty
                ? "bg-content/5 text-content/20 cursor-not-allowed"
                : "bg-content text-surface hover:bg-primary transition-colors shadow-2xl shadow-content/10",
            )}
          >
            {loading ? "Processing Order..." : "Complete Purchase"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
