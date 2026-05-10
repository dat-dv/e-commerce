"use client";

import React from "react";
import { Carousel, CarouselItem } from "@/components/molecules/carousel";
import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";
import { ProductCard, Product } from "@/components/molecules/product-card";

interface ProductCarouselProps {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  products: Product[] | Product[][]; // Support both flat array (1 row) and array of arrays (2 rows)
  rows: 1 | 2;
}

export const ProductCarousel = ({
  title,
  icon: Icon,
  iconColor = "text-content",
  products,
  rows,
}: ProductCarouselProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-content flex items-center gap-2">
          <Icon className={`w-5 h-5 ${iconColor}`} />
          {title}
        </h2>
        <Link
          href="/products"
          className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <Carousel options={{ align: "start" }}>
        {rows === 1
          ? (products as Product[]).map((product) => (
              <CarouselItem
                key={product.id}
                className="flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%]"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))
          : (products as Product[][]).map((column, index) => (
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
