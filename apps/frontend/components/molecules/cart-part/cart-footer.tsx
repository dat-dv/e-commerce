"use client";

import React from "react";
import { Ticket, ChevronRight } from "lucide-react";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";

interface CartFooterProps {
  selectedCount: number;
  totalAmount: number;
}

export const CartFooter = ({ selectedCount, totalAmount }: CartFooterProps) => {
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-3xl border-t border-content/[0.05] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-40 overflow-hidden mt-12 mb-8">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-primary/30 blur-md pointer-events-none" />

      <div className="bg-primary/[0.1] border-b border-primary/5 px-8 py-3 flex items-center justify-center md:justify-end gap-8 text-xs font-medium">
        <button className="text-content/70 hover:text-primary transition-all flex items-center gap-2 group">
          <Ticket size={14} className="text-primary/60" />
          Apply coupon{" "}
          <ChevronRight
            size={14}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>

      <div className="container mx-auto max-w-7xl px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-8 relative">
        <div className="flex items-center gap-10"></div>
        <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end">
          <div className="text-right">
            <div className="text-xs font-medium text-content/40 mb-1">
              Order subtotal
            </div>
            <div className="text-4xl md:text-5xl font-bold text-content tracking-tighter leading-none">
              ${totalAmount.toLocaleString()}
            </div>
          </div>

          <Link
            href={selectedCount > 0 ? APP_ROUTES.CHECKOUT : "#"}
            className={cn(
              "px-16 h-16 flex items-center justify-center rounded-2xl font-bold text-sm transition-all relative overflow-hidden group",
              selectedCount > 0
                ? "bg-primary text-surface shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98]"
                : "bg-content/[0.05] text-content/20 cursor-not-allowed",
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
