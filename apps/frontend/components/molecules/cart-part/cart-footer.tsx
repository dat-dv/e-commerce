"use client";

import React from "react";
import { Ticket, ChevronRight, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";
import { Checkbox } from "./checkbox";
import { cn } from "@/utils/cn";

interface CartFooterProps {
  itemCount: number;
  selectedCount: number;
  totalAmount: number;
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
  onDeleteSelected: () => void;
}

export const CartFooter = ({
  itemCount,
  selectedCount,
  totalAmount,
  isAllSelected,
  onToggleSelectAll,
  onDeleteSelected,
}: CartFooterProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-3xl border-t border-content/[0.08] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] z-40 overflow-hidden">
      {/* Ambient Light Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-primary/30 blur-md pointer-events-none" />

      {/* Voucher Row (Refined) */}
      <div className="bg-primary/[0.03] border-b border-primary/5 px-8 py-3 flex items-center justify-center md:justify-end gap-8 text-[10px] uppercase tracking-[0.3em] font-black">
        <div className="flex items-center gap-3 text-content/40">
          <Ticket size={14} className="text-primary/60" />
          <span className="italic font-light">Exclusive Voucher Applied:</span>
          <span className="text-primary">-$50.00</span>
        </div>
        <button className="text-content hover:text-primary transition-all flex items-center gap-2 group">
          Apply Coupon{" "}
          <ChevronRight
            size={14}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>

      <div className="container mx-auto max-w-7xl px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-8 relative">
        <div className="flex items-center gap-10">
          <div
            className="flex items-center gap-4 group cursor-pointer"
            onClick={onToggleSelectAll}
          >
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={onToggleSelectAll}
            />
            <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] group-hover:text-primary transition-colors">
                Select All
              </span>
              <span className="text-[9px] font-medium text-content/30 uppercase tracking-widest italic">
                {itemCount} units available
              </span>
            </div>
          </div>

          <div className="h-8 w-px bg-content/10 hidden sm:block" />

          <div className="flex items-center gap-8">
            <button
              onClick={onDeleteSelected}
              disabled={selectedCount === 0}
              className={cn(
                "transition-all uppercase text-[10px] tracking-[0.3em] font-black flex items-center gap-2 group",
                selectedCount > 0
                  ? "text-content/40 hover:text-red-500"
                  : "opacity-20 cursor-not-allowed",
              )}
            >
              <Trash2
                size={14}
                className={cn(
                  selectedCount > 0 &&
                    "group-hover:scale-110 transition-transform",
                )}
              />
              Remove
            </button>
          </div>
        </div>

        <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end">
          <div className="text-right">
            <div className="text-[9px] font-black uppercase tracking-[0.5em] text-content/20 mb-2">
              Order Subtotal
            </div>
            <div className="text-4xl md:text-5xl font-black text-content tracking-tighter leading-none">
              ${totalAmount.toLocaleString()}
            </div>
          </div>

          <Link
            href={selectedCount > 0 ? APP_ROUTES.CHECKOUT : "#"}
            className={cn(
              "px-16 h-16 flex items-center justify-center rounded-2xl font-black text-[12px] uppercase tracking-[0.4em] transition-all relative overflow-hidden group",
              selectedCount > 0
                ? "bg-content text-surface hover:bg-primary hover:text-primary-foreground shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:shadow-primary/30"
                : "bg-content/[0.05] text-content/20 cursor-not-allowed",
            )}
            onClick={(e) => selectedCount === 0 && e.preventDefault()}
          >
            <span className="relative z-10">Checkout</span>
            {selectedCount > 0 && (
              <motion.div
                className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"
                initial={false}
              />
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};
