import React from "react";
import { Zap } from "lucide-react";
import { FlashSaleCard } from "../product-card/flash-sale-card";
import { SectionHeader } from "../section-header";
import { TFlashSaleProduct } from "@/domain/products/types/products.model";

interface FlashSaleProps {
  products: TFlashSaleProduct[];
}

export const FlashSale = ({ products }: FlashSaleProps) => {
  if (!products || products.length === 0) return null;

  // Lấy thời gian kết thúc từ SKU đầu tiên của sản phẩm đầu tiên
  const firstSku = products[0]?.skus?.[0];
  const endTime = firstSku?.flashSaleEnd
    ? new Date(firstSku.flashSaleEnd)
    : undefined;

  return (
    <section className="space-y-6">
      <SectionHeader
        title="Flash Sale"
        icon={<Zap className="text-primary fill-primary" size={20} />}
        href="#"
        countdown={endTime}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <FlashSaleCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
