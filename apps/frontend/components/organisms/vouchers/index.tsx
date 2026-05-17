"use client";

import AppContainer from "@/components/atoms/app-container";
import VoucherHeader from "./voucher-header";
import VoucherList from "./voucher-list";

export const VoucherView = () => {
  return (
    <>
      <VoucherHeader />
      <AppContainer className="pb-24">
        <VoucherList />
      </AppContainer>
    </>
  );
};

export default VoucherView;
