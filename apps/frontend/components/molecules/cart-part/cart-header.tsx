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
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-xl mb-6 flex items-center gap-3 shadow-lg shadow-orange-500/20">
        <div className="bg-white/20 p-1.5 rounded-lg">
          <ShoppingBag size={20} />
        </div>
        <p className="text-sm font-bold">
          Siêu Rẻ - Chỉ Từ 1.000Đ. Săn ngay kẻo lỡ!
        </p>
      </div>

      {/* Main Title */}
      <h1 className="text-2xl font-black mb-6 text-content flex items-center gap-2">
        Giỏ hàng
        <span className="text-sm font-normal text-content/40 bg-content/[0.05] px-2 py-0.5 rounded-full">
          {itemCount} sản phẩm
        </span>
      </h1>
    </>
  );
};
