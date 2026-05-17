"use client";

import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import { Ticket, Tags, Gift, Sparkles } from "lucide-react";

/**
 * VoucherHeader displays an animated, responsive page header for the Voucher marketplace page.
 * It uses dynamic floating background icons to establish a premium and playful shopping aesthetic.
 */
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
