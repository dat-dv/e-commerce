import { APP_ROUTES } from "@/constants/routes";
import { TProduct } from "@/domain/products/types/products.model";
import { LucideIcon } from "lucide-react";
import { useMemo } from "react";
import { Carousel, CarouselItem } from "../carousel";
import { PRODUCT_CAROUSEL_ITEM_CLASS } from "../carousel/carousel.constants";
import { ProductCard } from "../product-card";
import { SectionHeader } from "../section-header";

const ProductCardSpacer = () => (
  <div
    aria-hidden="true"
    className="flex h-full flex-1 flex-col p-3 pointer-events-none invisible"
  >
    <div className="relative aspect-square rounded-xl bg-transparent" />
    <div className="mt-3 flex flex-col flex-grow">
      <span className="text-[10px]">&nbsp;</span>
      <h3 className="mt-1 text-sm font-bold">&nbsp;</h3>
      <div className="mt-1 flex items-center gap-2">&nbsp;</div>
      <div className="mt-auto pt-3 flex items-center justify-between">
        &nbsp;
      </div>
    </div>
  </div>
);

interface IProductCarouselProps {
  title: string;
  href?: string;
  icon: LucideIcon;
  products: TProduct[];
  rows: 1 | 2;
  lang: string;
  itemClassName?: string;
}

export const ProductCarousel = ({
  title,
  href,
  icon: Icon,
  products,
  rows = 1,
  itemClassName = PRODUCT_CAROUSEL_ITEM_CLASS,
}: IProductCarouselProps) => {
  const carouselProducts = useMemo(() => {
    if (rows === 1) {
      return products.map((product) => [product]);
    }

    const chunked: TProduct[][] = [];

    for (let i = 0; i < products.length; i += rows) {
      chunked.push(products.slice(i, i + rows));
    }

    return chunked;
  }, [products, rows]);

  return (
    <section className="flex flex-col gap-4 sm:gap-6">
      <SectionHeader
        title={title}
        href={href || APP_ROUTES.PRODUCTS}
        icon={<Icon className="size-4 shrink-0 text-primary sm:size-5" />}
      />

      <Carousel options={{ align: "start" }}>
        {carouselProducts.map((column, index) => (
          <CarouselItem key={index} className={itemClassName}>
            <div className="flex flex-grow flex-col gap-4 sm:gap-6">
              {column.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {rows > 1 && column.length < rows ? <ProductCardSpacer /> : null}
            </div>
          </CarouselItem>
        ))}
      </Carousel>
    </section>
  );
};
