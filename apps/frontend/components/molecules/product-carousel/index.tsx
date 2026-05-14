"use client";

import React from "react";
import { Carousel, CarouselItem } from "@/components/molecules/carousel";
import { LucideIcon } from "lucide-react";
import { ProductCard } from "@/components/molecules/product-card";
import { TProduct } from "@/domain/products/types/products.model";
import { APP_ROUTES } from "@/constants/routes";
import { SectionHeader } from "../section-header";

interface ProductCarouselProps {
  title: string;
  icon: LucideIcon;
  products: TProduct[] | TProduct[][]; // Support both flat array (1 row) and array of arrays (2 rows)
  rows: 1 | 2;
}

export const ProductCarousel = ({
  title,
  icon: Icon,
  products,
  rows,
}: ProductCarouselProps) => {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title={title}
        href={APP_ROUTES.PRODUCTS}
        icon={<Icon className="w-5 h-5 text-purple-500" />}
        lang="en"
      />

      <Carousel options={{ align: "start" }}>
        {rows === 1
          ? (products as TProduct[]).map((product) => (
              <CarouselItem
                key={product.id}
                className="flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%]"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))
          : (products as TProduct[][]).map((column, index) => (
              <CarouselItem
                key={index}
                className="flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%]"
              >
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
