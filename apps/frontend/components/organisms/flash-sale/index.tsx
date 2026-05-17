import { FlashSaleHeader } from "./flash-sale-header";
import AppContainer from "@/components/atoms/app-container";
import FlashSaleList from "./flash-sale-list";
import { TProduct } from "@/domain/products/types/products.model";
import { IPaginationMeta } from "@/utils/request/request.types";

interface FlashSaleViewProps {
  products: TProduct[];
  meta: IPaginationMeta;
}

const FlashSaleView = ({ products, meta }: FlashSaleViewProps) => {
  return (
    <AppContainer>
      <FlashSaleHeader />
      <FlashSaleList products={products} meta={meta} />
    </AppContainer>
  );
};

export default FlashSaleView;
