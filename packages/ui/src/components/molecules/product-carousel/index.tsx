"use client";

import { APP_ROUTES } from "@/constants/routes";
import { TProduct } from "@/domain/products/types/products.model";
import { LucideIcon } from "lucide-react";
import { useMemo } from "react";
import { Carousel, CarouselItem } from "../carousel";
import { ProductCard } from "../product-card";
import { SectionHeader } from "../section-header";

interface IProductCarouselProps {
  title: string;
  href?: string;
  icon: LucideIcon;
  products: TProduct[];
  rows?: 1 | 2;
  lang: string;
}

const DESKTOP_COLUMNS = 4;

export const ProductCarousel = ({
  title,
  href,
  icon: Icon,
  products,
  rows = 1,
}: IProductCarouselProps) => {
  const carouselPages = useMemo(() => {
    const itemsPerPage = rows * DESKTOP_COLUMNS;
    const result: TProduct[][] = [];

    for (let i = 0; i < products.length; i += itemsPerPage) {
      result.push(products.slice(i, i + itemsPerPage));
    }

    return result;
  }, [products, rows]);

  if (products.length === 0) return null;

  return (
    <section className="flex flex-col gap-4 sm:gap-6">
      <SectionHeader
        title={title}
        href={href || APP_ROUTES.PRODUCTS}
        icon={<Icon className="text-primary size-4 shrink-0 sm:size-5" />}
      />

      <Carousel options={{ align: "start" }}>
        {carouselPages.map((page, pageIndex) => (
          <CarouselItem key={pageIndex} className="flex-[0_0_100%]">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
              {page.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </CarouselItem>
        ))}
      </Carousel>
    </section>
  );
};
