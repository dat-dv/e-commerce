import { Metadata } from "next";
import VoucherView from "@/components/organisms/vouchers";

export const metadata: Metadata = {
  title: "Voucher Wallet | E-Commerce",
  description:
    "Collect promo codes, free shipping coupons, and cashback vouchers",
};

export default function VouchersPage() {
  return <VoucherView />;
}
