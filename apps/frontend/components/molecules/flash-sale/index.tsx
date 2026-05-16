import React from "react";
import { Zap } from "lucide-react";
import { FlashSaleCard } from "../product-card/flash-sale-card";
import { SectionHeader } from "../section-header";
import { TFlashSaleProduct } from "@/domain/products/types/products.model";
import { Carousel, CarouselItem } from "../carousel";
import { PRODUCT_CAROUSEL_ITEM_CLASS } from "../carousel/carousel.constants";
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
            className={PRODUCT_CAROUSEL_ITEM_CLASS}
          >
            <FlashSaleCard product={product} />
          </CarouselItem>
        ))}
      </Carousel>
    </section>
  );
};
