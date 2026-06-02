"use client";

import { Heart } from "lucide-react";

import { EmptyTabState } from "@/components/molecules/empty-tab-state";
import { formatCurrency } from "@/components/organisms/products-view/product.utils";
import { formatAdminDate } from "@/components/organisms/user-detail-view/user-detail-view.utils";
import { useUserDetailFavorites } from "@/hooks/user/use-user-detail-favorites";

export const UserDetailFavoritesTab = ({ userId }: { userId: string }) => {
  const { favorites, loading } = useUserDetailFavorites(userId);

  if (loading) {
    return (
      <div className="p-8 text-center text-[var(--muted)]">
        Loading favorites...
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-content text-lg font-bold">Favorites</h2>
          <p className="text-content/50 mt-1 text-sm">
            Showing the latest {favorites.items.length} of{" "}
            {favorites.meta.total} favorite products.
          </p>
        </div>
      </div>

      {favorites.items.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {favorites.items.map((favorite) => (
            <article
              key={favorite.productId}
              className="rounded-lg border border-[var(--border-color)] bg-[var(--app-bg)]/30 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="bg-content/5 h-12 w-12 shrink-0 overflow-hidden rounded-md">
                  {favorite.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={favorite.thumbnailUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-content truncate text-sm font-semibold">
                    {favorite.productName}
                  </p>
                  <p className="text-content/45 mt-0.5 truncate text-xs">
                    {favorite.productSlug}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                    <span className="text-primary font-semibold">
                      {formatCurrency(favorite.basePrice)}
                    </span>
                    <span className="text-content/45">
                      {formatAdminDate(favorite.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyTabState
          icon={Heart}
          title="No favorites yet"
          description="This customer has not favorited any products."
        />
      )}
    </section>
  );
};

UserDetailFavoritesTab.displayName = "UserDetailFavoritesTab";
