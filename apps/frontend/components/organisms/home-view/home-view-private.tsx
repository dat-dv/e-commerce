"use client";

import React from "react";
import AppContainer from "@/components/atoms/app-container";
import { FeatureGrid } from "@/components/molecules/feature-grid";
import { FlashSale } from "@/components/molecules/flash-sale";
import { CategoriesGrid } from "@/components/molecules/categories-grid";
import { ProductCarousel } from "@/components/molecules/product-carousel";
import { WelcomeBanner } from "@/components/molecules/welcome-banner";
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
  RefreshCw,
  Zap,
} from "lucide-react";
import { useAuthStore } from "@/hooks/auth/use-auth-store";

const FLASH_SALE_PRODUCTS = [
  {
    id: 1,
    name: "Wireless Earbuds Pro",
    price: "$29.00",
    oldPrice: "$59.00",
    sold: 45,
    total: 100,
  },
  {
    id: 2,
    name: "Smart Fitness Tracker",
    price: "$19.00",
    oldPrice: "$39.00",
    sold: 80,
    total: 100,
  },
  {
    id: 3,
    name: "Portable Power Bank",
    price: "$15.00",
    oldPrice: "$25.00",
    sold: 12,
    total: 50,
  },
  {
    id: 4,
    name: "Bluetooth Speaker Mini",
    price: "$25.00",
    oldPrice: "$49.00",
    sold: 95,
    total: 100,
  },
];

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
  },
  {
    name: "Vouchers",
    desc: "Save extra",
    icon: Ticket,
    color: "text-pink-500",
  },
  {
    name: "Fast Delivery",
    desc: "2H shipping",
    icon: Truck,
    color: "text-blue-500",
  },
  {
    name: "Top Brands",
    desc: "Certified stores",
    icon: Star,
    color: "text-yellow-500",
  },
  {
    name: "New Arrivals",
    desc: "Fresh drops",
    icon: Sparkles,
    color: "text-purple-500",
  },
  { name: "Flash Sale", desc: "Ending soon", icon: Zap, color: "text-red-500" },
];

const TRENDING_PRODUCTS = [
  {
    id: 1,
    name: "Minimalist Wireless Keyboard",
    price: "$89.00",
    category: "Electronics",
  },
  {
    id: 2,
    name: "Premium Leather Backpack",
    price: "$120.00",
    category: "Accessories",
  },
  {
    id: 3,
    name: "Smart Water Bottle",
    price: "$45.00",
    category: "Home & Living",
  },
  {
    id: 4,
    name: "Noise Cancelling Headphones",
    price: "$299.00",
    category: "Electronics",
  },
  {
    id: 5,
    name: "Mechanical Gaming Keyboard",
    price: "$129.00",
    category: "Electronics",
  },
  {
    id: 6,
    name: "Ergonomic Desk Chair",
    price: "$199.00",
    category: "Home & Living",
  },
  {
    id: 7,
    name: "Wireless Charging Pad",
    price: "$35.00",
    category: "Electronics",
  },
  {
    id: 8,
    name: "Leather Passport Holder",
    price: "$25.00",
    category: "Accessories",
  },
];

const TECH_PRODUCTS = [
  {
    id: 9,
    name: "Ultra-wide Curved Monitor",
    price: "$499.00",
    category: "Electronics",
  },
  {
    id: 10,
    name: "RGB Mechanical Keyboard",
    price: "$149.00",
    category: "Electronics",
  },
  {
    id: 11,
    name: "Wireless Gaming Mouse",
    price: "$79.00",
    category: "Electronics",
  },
  {
    id: 12,
    name: "Noise Cancelling Earbuds",
    price: "$159.00",
    category: "Electronics",
  },
];

export const HomepagePrivate = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex flex-col gap-12 pb-20" data-testid="private-home">
      <AppContainer className="flex flex-col gap-12 pt-10">
        {/* 1. Welcome Banner */}
        <WelcomeBanner
          userName={user?.name || "Shopper"}
          cartCount={3}
          orderCount={1}
        />
        {/* 2. Feature Cards Grid */}
        <FeatureGrid items={FEATURE_ITEMS} />

        {/* 3. Flash Sale */}
        <FlashSale products={FLASH_SALE_PRODUCTS} />

        {/* 4. Categories */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-content flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Your Top Categories
            </h2>
          </div>
          <CategoriesGrid categories={POPULAR_CATEGORIES} />
        </div>

        {/* 5. Recommended for You Section */}
        <ProductCarousel
          title="Recommended for You"
          icon={Heart}
          iconColor="text-pink-500"
          products={TRENDING_PRODUCTS}
          rows={1}
        />

        {/* 6. Based on Your Interest Section */}
        <ProductCarousel
          title="Based on Your Interest"
          icon={Laptop}
          iconColor="text-blue-500"
          products={TECH_PRODUCTS}
          rows={1}
        />

        {/* 7. Recently Viewed Section */}
        <ProductCarousel
          title="Recently Viewed"
          icon={Eye}
          iconColor="text-blue-400"
          products={TRENDING_PRODUCTS}
          rows={1}
        />

        {/* 8. Buy It Again Section */}
        <ProductCarousel
          title="Buy It Again"
          icon={RefreshCw}
          iconColor="text-green-500"
          products={TECH_PRODUCTS}
          rows={1}
        />
      </AppContainer>
    </div>
  );
};

export default HomepagePrivate;
