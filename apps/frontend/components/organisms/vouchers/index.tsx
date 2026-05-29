"use client";

import { AppContainer } from "@ecommerce/ui";
import VoucherHeader from "./voucher-header";
import VoucherList from "./voucher-list";

export const VoucherView = () => {
  return (
    <AppContainer className="pb-14 sm:pb-20 lg:pb-24">
      <VoucherHeader />
      <VoucherList />
    </AppContainer>
  );
};

export default VoucherView;
