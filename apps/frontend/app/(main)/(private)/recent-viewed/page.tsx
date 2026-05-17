import type { Metadata } from "next";

import { RecentViewedProvider } from "@/components/molecules/providers/recent-viewed-provider";
import { RecentViewedView } from "@/components/organisms/recent-viewed/recent-viewed-view";
import { productsUseCase } from "@/domain/products/use-cases";
import { safe } from "@/utils/promise";

export const metadata: Metadata = {
  title: "Recently Viewed | E-Commerce",
  description: "Products you recently viewed.",
};

export default async function RecentViewedPage() {
  return <RecentViewedView />;
}
