"use client";

import { APP_ROUTES } from "@/constants/routes";
import { Flame } from "lucide-react";
import { SectionHeader } from "../section-header";
import { FlashSaleCard } from "../product-card/flash-sale-card";

interface FlashSaleProduct {
  id: string;
  name: string;
  category: string;
  image_url?: string;
  skus: {
    id: string;
    price: string;
    original_price?: string;
    discount_percent?: number;
    sold?: number;
    total?: number;
    image_url?: string;
  }[];
}

interface FlashSaleProps {
  products: FlashSaleProduct[];
}

export const FlashSale = ({ products }: FlashSaleProps) => {
  return (
    <div className="bg-surface border border-content/[0.05] rounded-3xl p-6 flex flex-col gap-6">
      <SectionHeader
        title="Flash Sale"
        href={APP_ROUTES.FLASH_SALE}
        icon={Flame}
        lang="en"
      >
        <div className="flex items-center gap-1.5">
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            01
          </span>
          <span className="text-content font-bold">:</span>
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            23
          </span>
          <span className="text-content font-bold">:</span>
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            45
          </span>
        </div>
      </SectionHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <FlashSaleCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
