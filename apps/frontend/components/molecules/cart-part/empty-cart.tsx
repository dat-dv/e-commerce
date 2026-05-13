"use client";

import React from "react";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";

interface EmptyCartProps {
  onSeedDummy: () => void;
}

export const EmptyCart = ({ onSeedDummy }: EmptyCartProps) => {
  return (
    <div className="bg-content/[0.02] border border-content/[0.05] backdrop-blur-md rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[40vh]">
      <div className="bg-content/[0.05] p-6 rounded-full mb-4">
        <ShoppingBag size={64} className="text-content/20" />
      </div>
      <h2 className="text-xl font-bold text-content mb-2">
        Giỏ hàng của bạn đang trống
      </h2>
      <p className="text-content/60 mb-6 max-w-md">
        Có vẻ như bạn chưa thêm sản phẩm nào. Hãy khám phá hàng ngàn sản phẩm
        hấp dẫn của chúng tôi!
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={APP_ROUTES.HOME}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          Tiếp tục mua sắm
        </Link>
        <button
          onClick={onSeedDummy}
          className="bg-content/[0.05] hover:bg-content/[0.1] text-content px-8 py-3 rounded-2xl font-bold transition-all active:scale-95 border border-content/[0.1] backdrop-blur-sm"
        >
          Nạp dữ liệu mẫu (Dummy)
        </button>
      </div>
    </div>
  );
};
