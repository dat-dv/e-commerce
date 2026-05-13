"use client";

import AppContainer from "@/components/atoms/app-container";
import { FeatureGrid } from "@/components/molecules/feature-grid";
import { FlashSale } from "@/components/molecules/flash-sale";
import { CategoriesGrid } from "@/components/molecules/categories-grid";
import { CategoriesSection } from "@/components/molecules/categories-section";
import { ProductCarousel } from "@/components/molecules/product-carousel";
import { WelcomeBanner } from "@/components/molecules/welcome-banner";
import { APP_ROUTES } from "@/constants/routes";
import {
  Flame,
  Laptop,
  Heart,
  Sparkles,
  Shirt,
  Home,
  Watch,
  Ticket,
  Star,
  Eye,
  Zap,
  LucideIcon,
} from "lucide-react";
import { useAuthStore } from "@/hooks/auth/use-auth-store";

const POPULAR_CATEGORIES = [
  {
    name: "Electronics",
    count: "1.2k+ Products",
    icon: Laptop,
    color: "text-blue-500",
  },
  {
    name: "Fashion",
    count: "800+ Products",
    icon: Shirt,
    color: "text-pink-500",
  },
  {
    name: "Home & Living",
    count: "500+ Products",
    icon: Home,
    color: "text-orange-500",
  },
  {
    name: "Accessories",
    count: "300+ Products",
    icon: Watch,
    color: "text-purple-500",
  },
];

const FEATURE_ITEMS = [
  {
    name: "Super Deals",
    desc: "Up to 70% off",
    icon: Flame,
    color: "text-orange-500",
    href: APP_ROUTES.SUPER_DEALS,
  },
  {
    name: "Vouchers",
    desc: "Coming soon",
    icon: Ticket,
    color: "text-pink-500",
    href: APP_ROUTES.VOUCHERS,
  },
  {
    name: "Top Brands",
    desc: "Certified stores",
    icon: Star,
    color: "text-yellow-500",
    href: APP_ROUTES.TOP_BRANDS,
  },
  {
    name: "New Arrivals",
    desc: "Fresh drops",
    icon: Sparkles,
    color: "text-purple-500",
    href: APP_ROUTES.NEW_ARRIVALS,
  },
  {
    name: "Flash Sale",
    desc: "Ending soon",
    icon: Zap,
    color: "text-red-500",
    href: APP_ROUTES.FLASH_SALE,
  },
];

import { HOMEPAGE_SECTION_TYPES } from "@/constants/homepage";

import { useProductsStore } from "@/hooks/products/use-products-store";
import { useHomepageCategories } from "@/hooks/categories/use-homepage-categories";

const SECTION_ICONS: Record<string, LucideIcon> = {
  [HOMEPAGE_SECTION_TYPES.FLASH_SALE]: Zap,
  [HOMEPAGE_SECTION_TYPES.RECOMMENDS]: Sparkles,
  [HOMEPAGE_SECTION_TYPES.RECENT_VIEW]: Eye,
  electronics: Laptop,
  "tv-audio-cameras": Laptop,
  "toys-baby-products": Sparkles,
  "beauty-health": Heart,
  "home-kitchen": Home,
  default: Sparkles,
};

const getIcon = (type: string, slug?: string) => {
  if (type === HOMEPAGE_SECTION_TYPES.FLASH_SALE) return Zap;
  if (type === HOMEPAGE_SECTION_TYPES.RECOMMENDS) return Sparkles;
  if (type === HOMEPAGE_SECTION_TYPES.RECENT_VIEW) return Eye;
  return SECTION_ICONS[slug || ""] || SECTION_ICONS.default;
};

export const HomepagePrivate = () => {
  const user = useAuthStore((state) => state.user);
  const sections = useProductsStore((state) => state.sections);
  const { categories, fetchMore, pagination } = useHomepageCategories();
  const lang = useProductsStore((state) => state.lang);

  return (
    <div className="flex flex-col gap-12 pb-20" data-testid="private-home">
      <AppContainer className="flex flex-col gap-12 pt-10">
        {/* 1. Welcome Banner */}
        <WelcomeBanner
          userName={`${user?.first_name || ""} ${user?.last_name || ""}`}
          cartCount={3}
          orderCount={1}
        />
        {/* 2. Feature Cards Grid */}
        <FeatureGrid items={FEATURE_ITEMS} />

        {/* Categories Section */}
        <CategoriesSection
          categories={categories}
          lang={lang}
          onLoadMore={fetchMore}
          total={pagination?.total}
          current={categories.length}
        />

        {/* 3. Dynamic Backend Sections */}
        {sections.map((section) => {
          if (
            section.category.type === HOMEPAGE_SECTION_TYPES.FLASH_SALE &&
            section.data.length > 0
          ) {
            return (
              <FlashSale key={section.category.id} products={section.data} />
            );
          }

          if (section.category.type === HOMEPAGE_SECTION_TYPES.CATEGORIES) {
            return (
              <div key={section.category.id} className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-content flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    {section.category.title}
                  </h2>
                </div>
                <CategoriesGrid categories={POPULAR_CATEGORIES} />
              </div>
            );
          }

          if (
            (section.category.type ===
              HOMEPAGE_SECTION_TYPES.PRODUCT_CAROUSEL ||
              section.category.type === HOMEPAGE_SECTION_TYPES.RECOMMENDS ||
              section.category.type === HOMEPAGE_SECTION_TYPES.RECENT_VIEW) &&
            section.data.length > 0
          ) {
            return (
              <ProductCarousel
                key={section.category.id}
                title={section.category.title}
                icon={getIcon(section.category.type, section.category.slug)}
                products={section.data}
                rows={1}
              />
            );
          }

          return null;
        })}
      </AppContainer>
    </div>
  );
};

export default HomepagePrivate;
