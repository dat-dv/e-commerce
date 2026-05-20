"use client";

import { APP_ROUTES } from "@/constants/routes";
import { TFlashSaleProduct } from "@/domain/products/types/products.model";
import { Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { Carousel, CarouselItem } from "../carousel";
import { PRODUCT_CAROUSEL_ITEM_CLASS } from "../carousel/carousel.constants";
import { FlashSaleCard } from "../product-card/flash-sale-card";
import { SectionHeader } from "../section-header";

interface IFlashSaleCarouselProps {
  products: TFlashSaleProduct[];
}

export const FlashSaleCarousel = ({ products }: IFlashSaleCarouselProps) => {
  const t = useTranslations("HomePage.sections");

  if (!products || products.length === 0) return null;
  return (
    <section className="space-y-4 sm:space-y-6">
      <SectionHeader
        title={t("flashSale")}
        icon={
          <Zap className="size-4 shrink-0 fill-primary text-primary sm:size-5" />
        }
        href={APP_ROUTES.FLASH_SALE}
      />

      <Carousel options={{ align: "start", containScroll: "trimSnaps" }}>
        {products.map((product) => (
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
