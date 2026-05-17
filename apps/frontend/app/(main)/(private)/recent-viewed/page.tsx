import type { Metadata } from "next";

import { RecentViewedView } from "@/components/organisms/recent-viewed/recent-viewed-view";

export const metadata: Metadata = {
  title: "Recently Viewed | E-Commerce",
  description: "Products you recently viewed.",
};

export default async function RecentViewedPage() {
  return <RecentViewedView />;
}
