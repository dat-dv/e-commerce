"use client";

import React, { useEffect, useState } from "react";
import { ProductCard, Product } from "@/components/molecules/product-card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";
import { motion } from "framer-motion";

export default function CartRecommendations() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/recommended`,
        );
        const data = await response.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, []);

  if (loading) {
    return (
      <div className="mt-12">
        <div className="h-8 w-48 bg-content/[0.05] animate-pulse rounded mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] bg-content/[0.05] animate-pulse rounded-2xl"
            />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-content uppercase tracking-tight flex items-center gap-2">
          <span className="w-1 h-6 bg-blue-600 rounded-full" />
          Có thể bạn cũng thích
        </h2>
        <Link
          href={APP_ROUTES.PRODUCTS}
          className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors"
        >
          Xem tất cả
          <ChevronRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
