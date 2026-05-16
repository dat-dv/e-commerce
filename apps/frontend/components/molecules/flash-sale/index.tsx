import React from "react";
import { Zap } from "lucide-react";
import { FlashSaleCard } from "../product-card/flash-sale-card";
import { SectionHeader } from "../section-header";
import { TFlashSaleProduct } from "@/domain/products/types/products.model";
import { Carousel, CarouselItem } from "../carousel";
import { APP_ROUTES } from "@/constants/routes";

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
  const previewProducts = products;

  return (
    <section className="space-y-6">
      <SectionHeader
        title="Flash Sale"
        icon={<Zap className="text-primary fill-primary" size={20} />}
        href={APP_ROUTES.FLASH_SALE}
        countdown={endTime}
      />

      <Carousel options={{ align: "start", containScroll: "trimSnaps" }}>
        {previewProducts.map((product) => (
          <CarouselItem
            key={product.id}
            className="flex-[0_0_78%] sm:flex-[0_0_48%] md:flex-[0_0_32%] lg:flex-[0_0_24%]"
          >
            <FlashSaleCard product={product} />
          </CarouselItem>
        ))}
      </Carousel>
    </section>
  );
};
