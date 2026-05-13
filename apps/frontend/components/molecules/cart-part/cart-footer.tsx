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
      <div className="bg-blue-50/80 backdrop-blur-md border-b border-blue-500/10 px-4 py-2 flex items-center justify-end gap-6 text-sm">
        <div className="flex items-center gap-2 text-content/60 font-medium">
          <Ticket size={16} className="text-blue-500" />
          Voucher giảm đến 50k
        </div>
        <button className="text-blue-600 font-bold hover:underline flex items-center gap-1 transition-all">
          Chọn hoặc nhập mã <ChevronRight size={14} />
        </button>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6 text-sm font-medium text-content/60">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={onToggleSelectAll}
            />
            <span className="hidden sm:inline">Chọn tất cả ({itemCount})</span>
            <span className="sm:hidden">Tất cả</span>
          </div>
          <button
            onClick={onDeleteSelected}
            disabled={selectedCount === 0}
            className={cn(
              "transition-colors",
              selectedCount > 0
                ? "hover:text-red-500 text-content/60"
                : "opacity-30 cursor-not-allowed",
            )}
          >
            Xóa
          </button>
          <button className="hover:text-blue-500 transition-colors hidden md:inline">
            Lưu vào mục đã thích
          </button>
        </div>

        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
          <div className="text-right">
            <div className="text-sm font-medium text-content/60">
              Tổng cộng ({selectedCount} sản phẩm):
            </div>
            <div className="text-xl md:text-2xl font-black text-blue-600">
              {totalAmount.toLocaleString("vi-VN")}₫
            </div>
          </div>
          <Link
            href={selectedCount > 0 ? APP_ROUTES.CHECKOUT : "#"}
            className={cn(
              "px-10 py-3.5 rounded-2xl font-bold text-lg transition-all shadow-xl active:scale-95",
              selectedCount > 0
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20"
                : "bg-content/[0.1] text-content/40 cursor-not-allowed shadow-none",
            )}
            onClick={(e) => selectedCount === 0 && e.preventDefault()}
          >
            Mua hàng
          </Link>
        </div>
      </div>
    </div>
  );
};
