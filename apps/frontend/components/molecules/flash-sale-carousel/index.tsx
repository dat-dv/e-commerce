import { Zap } from "lucide-react";
import { FlashSaleCard } from "../product-card/flash-sale-card";
import { SectionHeader } from "../section-header";
import { TFlashSaleProduct } from "@/domain/products/types/products.model";
import { Carousel, CarouselItem } from "../carousel";
import { PRODUCT_CAROUSEL_ITEM_CLASS } from "../carousel/carousel.constants";
import { APP_ROUTES } from "@/constants/routes";

interface IFlashSaleCarouselProps {
  products: TFlashSaleProduct[];
}

export const FlashSaleCarousel = ({ products }: IFlashSaleCarouselProps) => {
  if (!products || products.length === 0) return null;
  return (
    <section className="space-y-6">
      <SectionHeader
        title="Flash Sale"
        icon={<Zap className="text-primary fill-primary" size={20} />}
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
