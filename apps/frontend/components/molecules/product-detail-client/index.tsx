"use client";

import { useCartStore } from "@/hooks/cart/use-cart-store";
import { motion } from "framer-motion";
import { Check, Heart, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    price: number;
    original_price: number;
    discount_percent: number;
    category: string;
    description: string;
    images: string[];
    colors: string[];
    rating: number;
    reviews_count: number;
  };
}

export default function ProductDetailClient({ product }: ProductDetailProps) {
  const addItem = useCartStore((s) => s.addItem);

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0] || "Black",
  );

  const handleAddToCart = () => {
    addItem(
      {
        id: `sku-${product.id}`,
        product_id: String(product.id),
        sku_id: `sku-${product.id}`,
        name: product.name,
        price: product.price,
        image_url: product.images[0],
        attributes: `Color: ${selectedColor}`,
      },
      quantity,
    );
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Left Column: Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="relative aspect-square bg-content/[0.02] border border-content/[0.05] rounded-3xl overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-content/[0.03] to-transparent" />
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.discount_percent && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg shadow-red-500/20">
                -{product.discount_percent}%
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, index) => (
              <div
                key={index}
                className={`relative aspect-square rounded-xl overflow-hidden border cursor-pointer transition-colors ${
                  index === 0
                    ? "border-blue-500"
                    : "border-content/[0.05] hover:border-content/[0.1]"
                } bg-content/[0.02]`}
              >
                <Image
                  src={img}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-content/[0.02] border border-content/[0.05] rounded-3xl p-6 lg:p-8 flex flex-col gap-6"
        >
          {/* Header Info */}
          <div>
            <span className="text-xs text-content/40 font-medium uppercase tracking-wider">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold mt-1 text-content">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-yellow-500">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" className="opacity-50" />
              </div>
              <span className="text-sm text-content/60">
                {product.rating} ({product.reviews_count} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="border-y border-content/[0.05] py-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-blue-500">
                {product.price.toLocaleString("vi-VN")} đ
              </span>
              {product.original_price && (
                <span className="text-lg text-content/30 line-through">
                  {product.original_price.toLocaleString("vi-VN")} đ
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-content/70 leading-relaxed">
            {product.description}
          </p>

          {/* Variant Selector (Colors) */}
          <div>
            <span className="text-sm font-medium text-content/60">Colors</span>
            <div className="flex items-center gap-3 mt-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                    selectedColor === color
                      ? "border-blue-500 scale-110"
                      : "border-content/[0.05] hover:border-content/[0.1]"
                  }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                >
                  {selectedColor === color && (
                    <Check
                      size={16}
                      className={
                        color === "White" ? "text-black" : "text-white"
                      }
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 mt-auto pt-4 border-t border-content/[0.05]">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-content/60">
                Quantity
              </span>
              <div className="flex items-center border border-content/[0.05] rounded-xl overflow-hidden bg-content/[0.02]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-content/[0.05] transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 font-medium min-w-10 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-content/[0.05] transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 bg-content/[0.05] hover:bg-content/[0.1] text-content py-4 rounded-xl font-medium transition-colors border border-content/[0.05] active:scale-98 transform"
              >
                <ShoppingBag size={20} />
                Add to Cart
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/20 active:scale-98 transform">
                Buy Now
              </button>
            </div>

            <button className="flex items-center justify-center gap-2 text-sm text-content/40 hover:text-red-500 transition-colors mt-2">
              <Heart size={16} />
              Add to Wishlist
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
