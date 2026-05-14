"use client";

import React from "react";

interface CartHeaderProps {
  itemCount: number;
}

export const CartHeader = ({ itemCount }: CartHeaderProps) => {
  return (
    <div className="flex items-end justify-between mb-8 border-b border-content/[0.05] pb-8">
      <h1 className="text-5xl md:text-7xl font-bold text-content tracking-tighter leading-none">
        Shopping <span className="italic font-light opacity-20">Bag</span>
      </h1>
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs font-medium text-content/30">
          Inventory volume
        </span>
        <span className="text-sm font-semibold text-content/60 bg-content/[0.03] px-5 py-2 rounded-full border border-content/[0.05]">
          {itemCount} items
        </span>
      </div>
    </div>
  );
};
