import FlashSaleView from "@/components/organisms/flash-sale";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flash Sale | E-Commerce",
  description: "Grab the best deals before they are gone!",
};

export default function FlashSalePage() {
  return <FlashSaleView />;
}
