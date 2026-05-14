"use client";

import React from "react";
import { ShoppingBag } from "lucide-react";

interface CartHeaderProps {
  itemCount: number;
}

export const CartHeader = ({ itemCount }: CartHeaderProps) => {
  return (
    <>
      {/* Promotional Banner */}
      <div className="bg-content text-surface p-4 rounded-xl mb-10 flex items-center justify-between gap-4 shadow-xl shadow-content/10">
        <div className="flex items-center gap-3">
          <div className="bg-surface/10 p-2 rounded-lg">
            <ShoppingBag size={18} />
          </div>
          <p className="text-xs font-black uppercase tracking-[0.2em]">
            Free Express Shipping on Orders Over $500
          </p>
        </div>
        <div className="hidden md:block h-px flex-1 bg-surface/10 mx-4" />
        <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest hidden sm:block">
          limited time offer
        </p>
      </div>

      {/* Main Title */}
      <div className="flex items-end justify-between mb-8 border-b border-content/[0.05] pb-8">
        <h1 className="text-5xl md:text-7xl font-black text-content tracking-tighter leading-none">
          SHOPPING <span className="italic font-light opacity-20">BAG</span>
        </h1>
        <div className="flex flex-col items-end gap-2">
          <span className="text-[9px] font-black uppercase tracking-[0.5em] text-content/30">
            inventory volume
          </span>
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-content/60 bg-content/[0.03] px-5 py-2 rounded-full border border-content/[0.05]">
            {itemCount} Items
          </span>
        </div>
      </div>
    </>
  );
};
