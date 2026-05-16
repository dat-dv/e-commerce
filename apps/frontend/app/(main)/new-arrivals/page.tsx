import NewArrivalView from "@/components/organisms/new-arrival/new-arrival-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Arrivals | E-Commerce",
  description:
    "Discover the latest products that have just arrived at our store.",
};

export default function NewArrivalsPage() {
  return <NewArrivalView />;
}
