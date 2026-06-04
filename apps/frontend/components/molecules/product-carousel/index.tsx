"use client";

import {
  Carousel,
  CarouselItem,
  SectionHeader,
  useResponsiveColumns,
} from "@ecommerce/ui";
import {
  PRODUCT_LISTING_GRID_COLUMNS,
  PRODUCT_LISTING_GRID_CLASS_NAME,
  PRODUCT_TWO_ROW_CAROUSEL_GRID_COLUMNS,
  PRODUCT_TWO_ROW_CAROUSEL_GRID_CLASS_NAME,
} from "@/constants/grid-presets";
import { APP_ROUTES } from "@/constants/routes";
import { TProduct } from "@/domain/products/types/products.model";
import { LucideIcon } from "lucide-react";
import { useMemo } from "react";
import Link from "next/link";

import { ProductCard } from "../product-card";

interface IProductCarouselProps {
  title: string;
  href?: string;
  icon: LucideIcon;
  products: TProduct[];
  rows?: 1 | 2;
  lang: string;
}

export const ProductCarousel = ({
  title,
  href,
  icon: Icon,
  products,
  rows = 1,
}: IProductCarouselProps) => {
  const gridClassName =
    rows === 2
      ? PRODUCT_TWO_ROW_CAROUSEL_GRID_CLASS_NAME
      : PRODUCT_LISTING_GRID_CLASS_NAME;
  const responsiveColumns = useResponsiveColumns(
    rows === 2
      ? PRODUCT_TWO_ROW_CAROUSEL_GRID_COLUMNS
      : PRODUCT_LISTING_GRID_COLUMNS,
  );

  const carouselPages = useMemo(() => {
    const itemsPerPage = rows * responsiveColumns;
    const result: TProduct[][] = [];

    for (let i = 0; i < products.length; i += itemsPerPage) {
      result.push(products.slice(i, i + itemsPerPage));
    }

    return result;
  }, [products, responsiveColumns, rows]);

  if (products.length === 0) return null;

  return (
    <section className="flex flex-col gap-4 sm:gap-6">
      <SectionHeader
        title={title}
        href={href || APP_ROUTES.PRODUCTS}
        icon={<Icon className="text-primary size-4 shrink-0 sm:size-5" />}
        linkComponent={Link}
      />

      <Carousel options={{ align: "start" }}>
        {carouselPages.map((page, pageIndex) => (
          <CarouselItem key={pageIndex} className="flex-[0_0_100%]">
            <div className={gridClassName}>
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
