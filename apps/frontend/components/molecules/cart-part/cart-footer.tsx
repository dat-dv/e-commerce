"use client";

import React from "react";
import { Ticket, ChevronRight } from "lucide-react";
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
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-content/[0.1] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
      {/* Voucher Row */}
      <div className="bg-primary/[0.02] backdrop-blur-md border-b border-primary/10 px-4 py-2.5 flex items-center justify-end gap-6 text-[11px] uppercase tracking-wider font-bold">
        <div className="flex items-center gap-2 text-content/60">
          <Ticket size={14} className="text-primary" />
          Available Voucher: -$50.00
        </div>
        <button className="text-primary hover:underline flex items-center gap-1 transition-all">
          Apply Coupon <ChevronRight size={12} />
        </button>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-8 text-sm font-bold text-content/60">
          <div
            className="flex items-center gap-3 group cursor-pointer"
            onClick={onToggleSelectAll}
          >
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={onToggleSelectAll}
            />
            <span className="hidden sm:inline hover:text-content transition-colors">
              Select All ({itemCount})
            </span>
            <span className="sm:hidden">All</span>
          </div>
          <button
            onClick={onDeleteSelected}
            disabled={selectedCount === 0}
            className={cn(
              "transition-colors uppercase text-[11px] tracking-widest font-black",
              selectedCount > 0
                ? "hover:text-red-500 text-content/60"
                : "opacity-30 cursor-not-allowed",
            )}
          >
            Remove
          </button>
          <button className="hover:text-primary transition-colors hidden md:inline uppercase text-[11px] tracking-widest font-black">
            Save to Wishlist
          </button>
        </div>

        <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
          <div className="text-right">
            <div className="text-[11px] font-black uppercase tracking-widest text-content/40 mb-1">
              Subtotal ({selectedCount} items):
            </div>
            <div className="text-2xl md:text-3xl font-black text-primary tracking-tighter">
              ${totalAmount.toLocaleString()}
            </div>
          </div>
          <Link
            href={selectedCount > 0 ? APP_ROUTES.CHECKOUT : "#"}
            className={cn(
              "px-12 py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95",
              selectedCount > 0
                ? "bg-content text-surface hover:bg-primary hover:text-white shadow-content/20"
                : "bg-content/[0.1] text-content/40 cursor-not-allowed shadow-none",
            )}
            onClick={(e) => selectedCount === 0 && e.preventDefault()}
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};
