import { FlashSaleHeader } from "./flash-sale-header";
import AppContainer from "@/components/atoms/app-container";
import FlashSaleList from "./flash-sale-list";

const FlashSaleView = () => {
  return (
    <AppContainer>
      <FlashSaleHeader />
      <FlashSaleList />
    </AppContainer>
  );
};

export default FlashSaleView;
