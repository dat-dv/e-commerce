import React from "react";
import { FlashSaleHeader } from "./flash-sale-header";
import AppContainer from "@/components/atoms/app-container";

const FlashSaleView = () => {
  return (
    <AppContainer>
      <FlashSaleHeader />
      <FlashSaleView />
    </AppContainer>
  );
};

export default FlashSaleView;
