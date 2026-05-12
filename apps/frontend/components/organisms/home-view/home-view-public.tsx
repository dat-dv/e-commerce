"use client";

import React, { useEffect, useState } from "react";
import AppContainer from "@/components/atoms/app-container";
import {
  Zap,
  Flame,
  Sparkles,
  Ticket,
  Truck,
  Star,
  Laptop,
  Shirt,
  Home,
  Watch,
  Heart,
} from "lucide-react";
import { APP_ROUTES } from "@/constants/routes";
import { productsUseCase } from "@/domain/products/use-cases";
import { IProduct } from "@/domain/products/types/products.model";
import { useProductsStore } from "@/hooks/products/use-products-store";
import { ProductCarousel } from "@/components/molecules/product-carousel";
import { HeroSection } from "@/components/molecules/hero-section";
import { FeatureGrid } from "@/components/molecules/feature-grid";
import { PromoBanner } from "@/components/molecules/promo-banner";
import { Newsletter } from "@/components/molecules/newsletter";
import { CategoriesGrid } from "@/components/molecules/categories-grid";
import { FlashSale } from "@/components/molecules/flash-sale";

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
    href: APP_ROUTES.CATEGORY("vouchers"),
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

const chunkArray = (arr: IProduct[], size: number): IProduct[][] => {
  const result: IProduct[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

export const HomepagePublic = () => {
  const flashSaleProducts = useProductsStore(
    (state) => state.flashSaleProducts,
  );
  const trendingProducts = useProductsStore(
    (state) => state.recommendedProducts,
  );
  const setFlashSaleProducts = useProductsStore(
    (state) => state.setFlashSaleProducts,
  );
  const setTrendingProducts = useProductsStore(
    (state) => state.setRecommendedProducts,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const flash = await productsUseCase.getFlashSale.execute();
        if (flash.status === "success" && flash.data)
          setFlashSaleProducts(flash.data);

        const rec = await productsUseCase.getRecommended.execute();
        if (rec.status === "success" && rec.data) setTrendingProducts(rec.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchData();
  }, []);

  // Tạo mảng 2 hàng cho phần Mom & Baby
  const babyProductsChunked = chunkArray(trendingProducts, 2);

  return (
    <div className="flex flex-col gap-12 pb-20" data-testid="public-home">
      {/* 1. Hero Banner Section */}
      <HeroSection />

      {/* Wrapping the rest in ONE AppContainer */}
      <AppContainer className="flex flex-col gap-12">
        {/* 2. Feature Cards Grid */}
        <FeatureGrid items={FEATURE_ITEMS} />

        {/* 3. Flash Sale */}
        {flashSaleProducts.length > 0 && (
          <FlashSale products={flashSaleProducts} />
        )}

        {/* 4. Categories */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-content flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Popular Categories
            </h2>
          </div>
          <CategoriesGrid categories={POPULAR_CATEGORIES} />
        </div>

        {/* 3. Trending Now Section */}
        {trendingProducts.length > 0 && (
          <ProductCarousel
            title="Trending Now"
            icon={Flame}
            iconColor="text-orange-500"
            products={trendingProducts}
            rows={1}
          />
        )}

        {/* 4. Technology Section */}
        {trendingProducts.length > 0 && (
          <ProductCarousel
            title="Technology"
            icon={Laptop}
            iconColor="text-blue-500"
            products={trendingProducts} // Tạm thời dùng chung dữ liệu thật
            rows={1}
          />
        )}

        {/* 5. Mom & Baby Section */}
        {babyProductsChunked.length > 0 && (
          <ProductCarousel
            title="Mom & Baby"
            icon={Heart}
            iconColor="text-pink-500"
            products={babyProductsChunked}
            rows={2}
          />
        )}

        {/* 4. Promotional Banner */}
        <PromoBanner />

        {/* 5. Newsletter */}
        <Newsletter />
      </AppContainer>
    </div>
  );
};

export default HomepagePublic;
