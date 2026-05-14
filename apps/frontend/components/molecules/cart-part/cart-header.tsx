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
      <div className="flex items-end justify-between mb-8 border-b border-content/[0.05] pb-6">
        <h1 className="text-4xl md:text-5xl font-black text-content tracking-tighter">
          Shopping Cart
        </h1>
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-content/40 bg-content/[0.03] px-4 py-1.5 rounded-full border border-content/[0.05]">
          {itemCount} Items
        </span>
      </div>
    </>
  );
};
