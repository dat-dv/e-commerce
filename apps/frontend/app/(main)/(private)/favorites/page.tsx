import { FavoritesView } from "@/components/organisms/favorites/favorites-view";
import { PAGINATION_LIMITS } from "@/constants/pagination.constant";
import { userFavoriteProductsUseCase } from "@/domain/user-favorite-products/use-cases";
import { safe } from "@/utils/promise";
import { createEmptyPaginatedData } from "@/utils/request/pagination";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("FavoritesPage.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

const LIMIT = PAGINATION_LIMITS.FAVORITES;

export default async function FavoritesPage() {
  const favoritesResponse = await safe(
    userFavoriteProductsUseCase.getUserFavoriteProductsUseCase.execute({
      page: 1,
      limit: LIMIT,
    }),
  );

  const favoritesData =
    favoritesResponse?.data ||
    createEmptyPaginatedData({
      page: 1,
      limit: LIMIT,
    });

  return <FavoritesView initialData={favoritesData} />;
}
