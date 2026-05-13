"use client";

import { useCartStore } from "@/hooks/cart/use-cart-store";
import { motion } from "framer-motion";
import { Heart, Minus, Plus, ShoppingBag, Share2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { TProduct } from "@/domain/products/types/products.model";

export interface ProductDetailProps {
  product: TProduct;
}

export default function ProductDetailClient({ product }: ProductDetailProps) {
  const addItem = useCartStore((s) => s.addItem);

  const [quantity, setQuantity] = useState(1);
  const [selectedSkuIndex, setSelectedSkuIndex] = useState(0);

  const selectedSku = product.skus[selectedSkuIndex];

  // Collect all available images
  const images = [
    product.image_url,
    ...product.skus.map((sku) => sku.image_url).filter(Boolean),
  ].filter((img): img is string => typeof img === "string");

  const [selectedImage, setSelectedImage] = useState(0);

  const price = selectedSku?.price ? Number(selectedSku.price) : 0;
  const originalPrice = selectedSku?.original_price
    ? Number(selectedSku.original_price)
    : null;
  const discountPercent = selectedSku?.discount_percent;

  const handleAddToCart = () => {
    if (!selectedSku) return;

    addItem(
      {
        id: selectedSku.id,
        product_id: product.id,
        sku_id: selectedSku.id,
        name: product.name,
        price: price,
        image_url: images[selectedImage] || product.image_url || "",
        attributes: "", // Trống vì TProduct chưa có attribute
      },
      quantity,
    );
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Images (Span 7) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-7 space-y-6"
        >
          {/* Main Image */}
          <div className="relative aspect-[4/3] bg-gradient-to-br from-content/[0.03] to-content/[0.01] border border-content/[0.05] rounded-3xl overflow-hidden flex items-center justify-center backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/[0.05] to-transparent pointer-events-none" />
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              {images[selectedImage] ? (
                <Image
                  src={images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-content/30">
                  No Image Available
                </div>
              )}
            </motion.div>

            {discountPercent && (
              <div className="absolute top-6 left-6 bg-red-500/90 backdrop-blur-md text-white text-sm font-bold px-4 py-2 rounded-2xl shadow-lg shadow-red-500/20">
                -{discountPercent}%
              </div>
            )}

            <button className="absolute top-6 right-6 p-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white transition-all hover:scale-105 active:scale-95">
              <Heart
                size={20}
                className="text-white hover:text-red-500 transition-colors"
              />
            </button>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                    index === selectedImage
                      ? "border-primary shadow-lg shadow-primary/10"
                      : "border-content/[0.05] hover:border-content/[0.1] bg-content/[0.02]"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right Column: Info (Span 5) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-5 bg-content/[0.02] border border-content/[0.05] backdrop-blur-xl rounded-3xl p-8 flex flex-col gap-6 h-fit sticky top-24"
        >
          {/* Header Info */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-primary font-semibold uppercase tracking-wider">
                {product.category}
              </span>
              <button className="text-content/40 hover:text-content transition-colors">
                <Share2 size={18} />
              </button>
            </div>
            <h1 className="text-4xl font-bold mt-2 text-content tracking-tight">
              {product.name}
            </h1>
          </div>

          {/* Price */}
          <div className="border-y border-content/[0.05] py-5">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-primary">
                {price.toLocaleString("vi-VN")} đ
              </span>
              {originalPrice && (
                <span className="text-lg text-content/30 line-through font-medium">
                  {originalPrice.toLocaleString("vi-VN")} đ
                </span>
              )}
            </div>
          </div>

          {/* SKUs Selector if multiple */}
          {product.skus.length > 1 && (
            <div>
              <span className="text-sm font-semibold text-content/60">
                Options
              </span>
              <div className="flex flex-wrap gap-2 mt-3">
                {product.skus.map((sku, index) => (
                  <button
                    key={sku.id}
                    onClick={() => {
                      setSelectedSkuIndex(index);
                      // Update image if SKU has one
                      const imgIndex = images.indexOf(sku.image_url || "");
                      if (imgIndex !== -1) setSelectedImage(imgIndex);
                    }}
                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                      selectedSkuIndex === index
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-content/[0.05] hover:border-content/[0.1] text-content/70"
                    }`}
                  >
                    Option {index + 1} (
                    {Number(sku.price).toLocaleString("vi-VN")} đ)
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-4 mt-auto pt-5 border-t border-content/[0.05]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-content/60">
                Quantity
              </span>
              <div className="flex items-center border border-content/[0.05] rounded-2xl overflow-hidden bg-content/[0.02] backdrop-blur-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-content/[0.05] transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 font-semibold min-w-10 text-center">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 bg-content/[0.05] hover:bg-content/[0.08] text-content py-4 rounded-2xl font-semibold transition-colors border border-content/[0.05]"
              >
                <ShoppingBag size={20} />
                Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-semibold transition-colors shadow-lg shadow-primary/20"
              >
                Buy Now
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
