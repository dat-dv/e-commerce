"use client";

import { Ticket } from "lucide-react";
import { APP_ROUTES } from "@/constants/routes";
import EmptyState from "@/components/molecules/empty-space";

export const VoucherList = () => {
  return (
    <EmptyState
      title="No Vouchers Available"
      description="Special promo codes, free shipping coupons, and cashback vouchers are on the way. Check back later to grab the best deals!"
      icon={Ticket}
      actionLabel="Continue Shopping"
      actionHref={APP_ROUTES.PRODUCTS}
    />
  );
};

export default VoucherList;
