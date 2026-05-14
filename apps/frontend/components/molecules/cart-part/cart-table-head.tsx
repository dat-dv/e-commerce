"use client";

import React from "react";
import { Checkbox } from "./checkbox";

interface CartTableHeadProps {
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
}

export const CartTableHead = ({
  isAllSelected,
  onToggleSelectAll,
}: CartTableHeadProps) => {
  return (
    <div className="bg-surface/50 backdrop-blur-xl sticky top-[72px] z-10 border border-content/[0.05] rounded-2xl p-6 shadow-sm hidden md:flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-content/30">
      <div className="flex items-center gap-4 flex-1">
        <Checkbox checked={isAllSelected} onCheckedChange={onToggleSelectAll} />
        <span className="ml-2">Product Details</span>
      </div>
      <div className="w-32 text-center">Unit Price</div>
      <div className="w-32 text-center">Quantity</div>
      <div className="w-32 text-center">Total</div>
      <div className="w-24 text-center">Action</div>
    </div>
  );
};
