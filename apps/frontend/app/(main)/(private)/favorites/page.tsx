import { FavoritesView } from "@/components/organisms/favorites/favorites-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Wishlist | Luxury E-commerce",
  description: "View and manage your favorite luxury acquisitions.",
};

export default function FavoritesPage() {
  return <FavoritesView />;
}
