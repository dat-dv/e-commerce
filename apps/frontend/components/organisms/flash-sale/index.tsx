import AppContainer from "@/components/atoms/app-container";
import { TProduct } from "@/domain/products/types/products.model";
import { ApiListResponse } from "@/utils/request/request.types";
import DiscoveryCarouselSection from "../discovery-sections";
import { FlashSaleHeader } from "./flash-sale-header";
import FlashSaleList from "./flash-sale-list";

interface FlashSaleViewProps {
  initialData: ApiListResponse<TProduct>;
}

const FlashSaleView = ({ initialData }: FlashSaleViewProps) => {
  return (
    <AppContainer className="space-y-2 sm:space-y-4">
      <FlashSaleHeader />
      <FlashSaleList initialData={initialData} />
      <DiscoveryCarouselSection />
    </AppContainer>
  );
};

export default FlashSaleView;
