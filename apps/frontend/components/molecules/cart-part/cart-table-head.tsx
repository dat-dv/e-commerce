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
    <div className="bg-white/80 backdrop-blur-md sticky top-[72px] z-10 border border-content/[0.05] rounded-2xl p-4 shadow-sm hidden md:flex items-center gap-4 text-sm font-bold text-content/60">
      <div className="flex items-center gap-3 flex-1">
        <Checkbox checked={isAllSelected} onCheckedChange={onToggleSelectAll} />
        <span>Sản phẩm</span>
      </div>
      <div className="w-32 text-center">Đơn giá</div>
      <div className="w-32 text-center">Số lượng</div>
      <div className="w-32 text-center">Số tiền</div>
      <div className="w-24 text-center">Thao tác</div>
    </div>
  );
};
