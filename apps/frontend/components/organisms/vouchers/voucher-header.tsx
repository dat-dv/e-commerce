"use client";

import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import { Ticket, Tags, Gift, Sparkles } from "lucide-react";

export const VoucherHeader = () => {
  return (
    <AnimatedPageHeader
      title="Voucher"
      highlight="Wallet"
      description="Collect promo codes, free shipping coupons, and cashback vouchers from leading brands."
      icons={[Ticket, Tags, Gift, Sparkles]}
    />
  );
};

export default VoucherHeader;
