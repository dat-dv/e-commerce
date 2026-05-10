"use client";

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
import { ProductCarousel } from "@/components/molecules/product-carousel";
import { HeroSection } from "@/components/molecules/hero-section";
import { FeatureGrid } from "@/components/molecules/feature-grid";
import { PromoBanner } from "@/components/molecules/promo-banner";
import { Newsletter } from "@/components/molecules/newsletter";
import { CategoriesGrid } from "@/components/molecules/categories-grid";
import { FlashSale } from "@/components/molecules/flash-sale";
import { APP_ROUTES } from "@/constants/routes";

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

const BABY_PRODUCTS = [
  [
    { id: 13, name: "Organic Baby Wipes", price: "$15.00", category: "Baby" },
    { id: 17, name: "Baby Shampoo", price: "$12.00", category: "Baby" },
  ],
  [
    {
      id: 14,
      name: "Vitamin C Supplements",
      price: "$25.00",
      category: "Health",
    },
    {
      id: 18,
      name: "Digital Thermometer",
      price: "$19.00",
      category: "Health",
    },
  ],
  [
    { id: 15, name: "Eco-friendly Diapers", price: "$35.00", category: "Baby" },
    {
      id: 19,
      name: "Baby Bottle Sterilizer",
      price: "$45.00",
      category: "Baby",
    },
  ],
  [
    { id: 16, name: "Moisturizing Cream", price: "$18.00", category: "Health" },
    { id: 20, name: "Soft Cotton Towels", price: "$22.00", category: "Baby" },
  ],
];

const HomepagePublic = () => {
  return (
    <div className="flex flex-col gap-12 pb-20" data-testid="public-home">
      {/* 1. Hero Banner Section */}
      <HeroSection />

      {/* Wrapping the rest in ONE AppContainer */}
      <AppContainer className="flex flex-col gap-12">
        {/* 2. Feature Cards Grid */}
        <FeatureGrid items={FEATURE_ITEMS} />

        {/* 3. Flash Sale */}
        <FlashSale products={FLASH_SALE_PRODUCTS} />

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
        <ProductCarousel
          title="Trending Now"
          icon={Flame}
          iconColor="text-orange-500"
          products={TRENDING_PRODUCTS}
          rows={1}
        />

        {/* 4. Technology Section */}
        <ProductCarousel
          title="Technology"
          icon={Laptop}
          iconColor="text-blue-500"
          products={TECH_PRODUCTS}
          rows={1}
        />

        {/* 5. Mom & Baby Section */}
        <ProductCarousel
          title="Mom & Baby"
          icon={Heart}
          iconColor="text-pink-500"
          products={BABY_PRODUCTS}
          rows={2}
        />

        {/* 4. Promotional Banner */}
        <PromoBanner />

        {/* 5. Newsletter */}
        <Newsletter />
      </AppContainer>
    </div>
  );
};

export default HomepagePublic;
