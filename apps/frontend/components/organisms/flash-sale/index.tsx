import { FlashSaleHeader } from "./flash-sale-header";
import AppContainer from "@/components/atoms/app-container";
import FlashSaleList from "./flash-sale-list";
import { TProduct } from "@/domain/products/types/products.model";
import { IPaginationMeta } from "@/utils/request/request.types";
import DiscoveryCarouselSection from "../discovery-sections";

interface FlashSaleViewProps {
  products: TProduct[];
  meta: IPaginationMeta;
}

const FlashSaleView = ({ products, meta }: FlashSaleViewProps) => {
  return (
    <AppContainer className="space-y-2 sm:space-y-4">
      <FlashSaleHeader />
      <FlashSaleList products={products} meta={meta} />
      <DiscoveryCarouselSection />
    </AppContainer>
  );
};

export default FlashSaleView;
