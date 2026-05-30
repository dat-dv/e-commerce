"use client";

import { APP_ROUTES } from "@/constants/routes";
import { TFlashSaleProduct } from "@/domain/products/types/products.model";
import { Carousel, CarouselItem, SectionHeader } from "@ecommerce/ui";
import { Zap } from "lucide-react";
import { useTranslations } from "next-intl";

import { PRODUCT_CAROUSEL_ITEM_CLASS } from "@/constants/grid-presets";
import Link from "next/link";
import { FlashSaleCard } from "../product-card/flash-sale-card";

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
          <Zap className="fill-primary text-primary size-4 shrink-0 sm:size-5" />
        }
        href={APP_ROUTES.FLASH_SALE}
        linkComponent={Link}
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
