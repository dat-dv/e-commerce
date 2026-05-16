"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  Clock,
  Heart,
  PackageSearch,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import { ProductsProvider } from "@/components/molecules/providers/products-provider";
import { ProfileForm } from "@/components/molecules/profile-form";
import { ProductCard } from "@/components/molecules/product-card";
import { APP_ROUTES } from "@/constants/routes";
import type { TProduct } from "@/domain/products/types/products.model";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useFavorites } from "@/hooks/favorites/use-favorites";
import { useRecentViewedProducts } from "@/hooks/products/use-recent-viewed-products";
import { useRecommendedProducts } from "@/hooks/products/use-recommended-products";
import { useUpdateProfile } from "@/hooks/profile/use-update-profile";
import { useUpLoadProfileAvatar } from "@/hooks/profile/use-upload-profile-avatar";

const PREVIEW_LIMIT = 4;

const ProfileQuickLink = ({
  href,
  icon,
  label,
  value,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  value: string;
}) => (
  <Link
    href={href}
    className="group flex items-center gap-4 rounded-2xl border border-content/[0.06] bg-content/[0.02] p-4 transition-all hover:border-primary/20 hover:bg-primary/[0.03]"
  >
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-sm font-black text-content">{label}</p>
      <p className="mt-0.5 truncate text-xs font-medium text-content/45">
        {value}
      </p>
    </div>
  </Link>
);

const ProfileProductPreview = ({
  title,
  href,
  icon,
  loading,
  products,
}: {
  title: string;
  href: string;
  icon: ReactNode;
  loading: boolean;
  products: TProduct[];
}) => (
  <section className="space-y-5">
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="text-primary">{icon}</span>
        <h2 className="text-lg font-black text-content">{title}</h2>
      </div>
      <Link
        href={href}
        className="text-xs font-black uppercase tracking-[0.18em] text-content/35 transition-colors hover:text-primary"
      >
        View all
      </Link>
    </div>

    {loading ? (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: PREVIEW_LIMIT }).map((_, index) => (
          <div
            key={index}
            className="aspect-[3/4] animate-pulse rounded-2xl border border-content/[0.05] bg-content/[0.03]"
          />
        ))}
      </div>
    ) : products.length > 0 ? (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {products.slice(0, PREVIEW_LIMIT).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    ) : (
      <div className="rounded-2xl border border-dashed border-content/10 bg-content/[0.02] p-8 text-center">
        <PackageSearch className="mx-auto mb-3 h-7 w-7 text-content/25" />
        <p className="text-sm font-semibold text-content/50">
          Nothing to show yet.
        </p>
      </div>
    )}
  </section>
);

const ProfileDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const { updateProfile, loading: isUpdating } = useUpdateProfile();
  const { uploadAvatar, isLoading: isUploading } = useUpLoadProfileAvatar();
  const { favorites, loading: loadingFavorites, meta } = useFavorites();
  const { recentViewedProducts, loading: loadingRecent } =
    useRecentViewedProducts(true);
  const { recommendedProducts, loadingRecommended } = useRecommendedProducts();

  const favoriteProducts = favorites
    .map((favorite) => favorite.product)
    .filter((product): product is NonNullable<typeof product> => !!product);

  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
          Profile
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-content">
          Your Account
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-content/50">
          Manage your profile and jump back into the products you care about.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ProfileQuickLink
          href={APP_ROUTES.FAVORITES}
          icon={<Heart size={20} />}
          label="Wishlist"
          value={`${meta.total} saved products`}
        />
        <ProfileQuickLink
          href={APP_ROUTES.RECENTLY_VIEWED}
          icon={<Clock size={20} />}
          label="Recently Viewed"
          value={`${recentViewedProducts.length} products`}
        />
        <ProfileQuickLink
          href={APP_ROUTES.ORDERS}
          icon={<ShoppingBag size={20} />}
          label="Orders"
          value="Track purchases"
        />
      </div>

      <ProfileForm
        user={user}
        updateProfile={updateProfile}
        uploadAvatar={uploadAvatar}
        isLoading={isUpdating}
        isUploading={isUploading}
      />

      <ProfileProductPreview
        title="Favorites"
        href={APP_ROUTES.FAVORITES}
        icon={<Heart size={18} />}
        loading={loadingFavorites}
        products={favoriteProducts}
      />

      <ProfileProductPreview
        title="Recently Viewed"
        href={APP_ROUTES.RECENTLY_VIEWED}
        icon={<Clock size={18} />}
        loading={loadingRecent}
        products={recentViewedProducts}
      />

      <ProfileProductPreview
        title="Recommended for You"
        href={APP_ROUTES.PRODUCTS}
        icon={<Sparkles size={18} />}
        loading={loadingRecommended}
        products={recommendedProducts}
      />
    </div>
  );
};

export default function ProfilePage() {
  return (
    <ProductsProvider>
      <ProfileDashboard />
    </ProductsProvider>
  );
}
