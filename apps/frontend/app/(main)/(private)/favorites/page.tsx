import { FavoritesView } from "@/components/organisms/favorites/favorites-view";
import { PAGINATION_LIMITS } from "@/constants/pagination.constant";
import { userFavoriteProductsUseCase } from "@/domain/user-favorite-products/use-cases";
import { createEmptyPaginatedData } from "@/utils/request/pagination";
import { safe } from "@/utils/promise";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Wishlist | Luxury E-commerce",
  description: "View and manage your favorite luxury acquisitions.",
};

const LIMIT = PAGINATION_LIMITS.FAVORITES;

export default async function FavoritesPage() {
  const favoritesResponse = await safe(
    userFavoriteProductsUseCase.getUserFavoriteProductsUseCase.execute(
      1,
      LIMIT,
    ),
  );

  const favoritesData =
    favoritesResponse?.data ||
    createEmptyPaginatedData({
      page: 1,
      limit: LIMIT,
    });

  return (
    <FavoritesView
      initialItems={favoritesData.items}
      initialMeta={favoritesData.meta}
    />
  );
}
