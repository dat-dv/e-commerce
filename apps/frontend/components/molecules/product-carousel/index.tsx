"use client";

import React from "react";
import { Carousel, CarouselItem } from "@/components/molecules/carousel";
import { LucideIcon } from "lucide-react";
import { ProductCard } from "@/components/molecules/product-card";
import { TProduct } from "@/domain/products/types/products.model";
import { APP_ROUTES } from "@/constants/routes";
import { SectionHeader } from "../section-header";
import { PRODUCT_CAROUSEL_ITEM_CLASS } from "../carousel/carousel.constants";

interface ProductCarouselProps {
  title: string;
  href?: string;
  icon: LucideIcon;
  products: TProduct[] | TProduct[][]; // Support both flat array (1 row) and array of arrays (2 rows)
  rows: 1 | 2;
  lang?: string;
}

export const ProductCarousel = ({
  title,
  href,
  icon: Icon,
  products,
  rows,
  lang,
}: ProductCarouselProps) => {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title={title}
        href={href || APP_ROUTES.PRODUCTS}
        icon={<Icon className="w-5 h-5 text-purple-500" />}
        lang={lang}
      />

      <Carousel options={{ align: "start" }}>
        {rows === 1
          ? (products as TProduct[]).map((product) => (
              <CarouselItem
                key={product.id}
                className={PRODUCT_CAROUSEL_ITEM_CLASS}
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))
          : (products as TProduct[][]).map((column, index) => (
              <CarouselItem key={index} className={PRODUCT_CAROUSEL_ITEM_CLASS}>
                <div className="flex flex-col gap-6">
                  {column.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </CarouselItem>
            ))}
      </Carousel>
    </div>
  );
};
