"use client";

import React, { useEffect, useState } from "react";
import AppContainer from "@/components/atoms/app-container";
import { FeatureGrid } from "@/components/molecules/feature-grid";
import { FlashSale } from "@/components/molecules/flash-sale";
import { CategoriesGrid } from "@/components/molecules/categories-grid";
import { ProductCarousel } from "@/components/molecules/product-carousel";
import { WelcomeBanner } from "@/components/molecules/welcome-banner";
import { APP_ROUTES } from "@/constants/routes";
import { productsUseCase } from "@/domain/products/use-cases";
import { IProduct } from "@/domain/products/types/products.model";
import {
  Flame,
  Laptop,
  Heart,
  Sparkles,
  Shirt,
  Home,
  Watch,
  Ticket,
  Truck,
  Star,
  Eye,
  Zap,
  LucideIcon,
} from "lucide-react";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { homepageUseCase } from "@/domain/homepage/use-cases";
import { IHomepageSection } from "@/domain/homepage/types/homepage.model";

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
    name: "Fast Delivery",
    desc: "2H shipping",
    icon: Truck,
    color: "text-blue-500",
    href: APP_ROUTES.FAST_DELIVERY,
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

const SECTION_ICONS: Record<string, LucideIcon> = {
  [HOMEPAGE_SECTION_TYPES.FLASH_SALE]: Zap,
  electronics: Laptop,
  "tv-audio-cameras": Laptop,
  "toys-baby-products": Sparkles,
  "beauty-health": Heart,
  "home-kitchen": Home,
  default: Sparkles,
};

const getIcon = (type: string, slug?: string) => {
  if (type === HOMEPAGE_SECTION_TYPES.FLASH_SALE) return Zap;
  return SECTION_ICONS[slug || ""] || SECTION_ICONS.default;
};

export const HomepagePrivate = () => {
  const user = useAuthStore((state) => state.user);

  const [sections, setSections] = useState<IHomepageSection[]>([]);
  const [interestProducts, setInterestProducts] = useState<IProduct[]>([]);
  const [recentProducts, setRecentProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch dynamic sections (Option A - Aggregated)
        const secRes = await homepageUseCase.getSections.execute();
        if (secRes.status === "success" && secRes.data) {
          setSections(secRes.data);
        }

        // 2. Keep specific use cases for personalized sections
        const interest = await productsUseCase.getBasedOnInterest.execute();
        if (interest.status === "success" && interest.data)
          setInterestProducts(interest.data);

        const recent = await productsUseCase.getRecentlyViewed.execute();
        if (recent.status === "success" && recent.data)
          setRecentProducts(recent.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchData();
  }, []);

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
            section.category.type === HOMEPAGE_SECTION_TYPES.PRODUCT_CAROUSEL &&
            section.data.length > 0
          ) {
            return (
              <ProductCarousel
                key={section.category.id}
                title={section.category.title}
                icon={getIcon(section.category.type, section.category.slug)}
                iconColor="text-blue-500"
                products={section.data}
                rows={1}
              />
            );
          }

          return null;
        })}

        {/* 4. Personalized Sections (Keeping FE Use Cases) */}
        {interestProducts.length > 0 && (
          <ProductCarousel
            title="Based on Your Interest"
            icon={Laptop}
            iconColor="text-blue-500"
            products={interestProducts}
            rows={1}
          />
        )}

        {/* 5. Recently Viewed Section */}
        {recentProducts.length > 0 && (
          <ProductCarousel
            title="Recently Viewed"
            icon={Eye}
            iconColor="text-blue-400"
            products={recentProducts}
            rows={1}
          />
        )}
      </AppContainer>
    </div>
  );
};

export default HomepagePrivate;
