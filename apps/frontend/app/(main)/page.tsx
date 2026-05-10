import type { Metadata } from "next";

import { HomeView } from "@/components/organisms/home-view";

export const metadata: Metadata = {
  title: "Home",
  description: "E-commerce platform with real-time focus.",
};

export default function Home() {
  return <HomeView />;
}
