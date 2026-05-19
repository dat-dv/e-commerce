import { APP_ROUTES } from "@/constants/routes";
import { TProduct } from "@/domain/products/types/products.model";
import { useMemo } from "react";
import { Carousel, CarouselItem } from "../carousel";
import { PRODUCT_CAROUSEL_ITEM_CLASS } from "../carousel/carousel.constants";
import { ProductCard } from "../product-card";
import { SectionHeader } from "../section-header";
import { LucideIcon } from "lucide-react";

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
}

export const ProductCarousel = ({
  title,
  href,
  icon: Icon,
  products,
  rows = 1,
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
    <div className="flex flex-col gap-6">
      <SectionHeader
        title={title}
        href={href || APP_ROUTES.PRODUCTS}
        icon={<Icon className="w-5 h-5 text-purple-500" />}
      />

      <Carousel options={{ align: "start" }}>
        {carouselProducts.map((column, index) => (
          <CarouselItem
            key={index}
            className={`${PRODUCT_CAROUSEL_ITEM_CLASS} flex flex-col items-stretch`}
          >
            <div className="flex flex-col gap-6 flex-grow">
              {column.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {rows > 1 && column.length < rows ? <ProductCardSpacer /> : null}
            </div>
          </CarouselItem>
        ))}
      </Carousel>
    </div>
  );
};
