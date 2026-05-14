"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Minus, Plus, ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/utils/format-currency";

interface ProductInfoProps {
  name: string;
  originalPrice: number;
  price: number;
  discountPercent: number;
  attributeGroups: Record<string, Set<string>>;
  selectedAttributes: Record<string, string>;
  setSelectedAttributes: (attrs: Record<string, string>) => void;
  quantity: number;
  setQuantity: (q: number) => void;
  handleAddToCart: () => void;
  handleBuyNow: () => void;
}

export const ProductInfo = ({
  name,
  originalPrice,
  price,
  discountPercent,
  attributeGroups,
  selectedAttributes,
  setSelectedAttributes,
  quantity,
  setQuantity,
  handleAddToCart,
  handleBuyNow,
}: ProductInfoProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="lg:col-span-7 flex flex-col gap-5"
    >
      {/* Product Title */}
      <h1 className="text-xl font-semibold text-content leading-snug">
        {name}
      </h1>

      {/* Rating, Reviews, Sold & Report */}
      <div className="flex items-center justify-between text-sm border-b border-content/[0.05] pb-4">
        <div className="flex items-center gap-4 divide-x divide-content/[0.1]">
          <div className="flex items-center gap-1">
            <span className="font-bold text-primary text-base">4.7</span>
            <div className="flex text-primary">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
          </div>
          <div className="pl-4 flex items-center gap-1">
            <span className="font-bold text-content">250</span>
            <span className="text-content/50 text-xs">Reviews</span>
          </div>
          <div className="pl-4 flex items-center gap-1">
            <span className="font-bold text-content">100k+</span>
            <span className="text-content/50 text-xs">Sold</span>
          </div>
        </div>
        <button className="text-content/40 hover:text-content text-xs font-medium transition-colors">
          Report
        </button>
      </div>

      {/* Price Box - Shopee Style */}
      <div className="bg-content/[0.02] p-4 rounded-xl flex items-center gap-4">
        {originalPrice > price && (
          <span className="text-content/40 line-through text-base">
            {formatCurrency(originalPrice)}
          </span>
        )}
        <span className="text-3xl font-bold text-primary">
          {formatCurrency(price)}
        </span>
        {originalPrice > price && discountPercent > 0 && (
          <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-lg">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Dynamic Options */}
      {Object.entries(attributeGroups).map(([attrName, values]) => (
        <div key={attrName} className="flex flex-col gap-3">
          <span className="text-sm font-medium text-content/60 w-24">
            {attrName}
          </span>
          <div className="flex flex-wrap gap-2">
            {Array.from(values).map((value) => (
              <button
                key={value}
                onClick={() =>
                  setSelectedAttributes({
                    ...selectedAttributes,
                    [attrName]: value,
                  })
                }
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedAttributes[attrName] === value
                    ? "border-primary text-primary bg-primary/5"
                    : "border-content/[0.1] hover:border-content/20 text-content/80"
                }`}
              >
                {value}
                {selectedAttributes[attrName] === value && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 3L4.5 8.5L2 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Quantity & Stock */}
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-content/60 w-24">
          Quantity
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-content/[0.1] rounded-lg overflow-hidden h-9">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 hover:bg-content/[0.05] transition-colors border-r border-content/[0.1]"
            >
              <Minus size={12} />
            </button>
            <span className="px-4 font-semibold text-sm min-w-[40px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 hover:bg-content/[0.05] transition-colors border-l border-content/[0.1]"
            >
              <Plus size={12} />
            </button>
          </div>
          <span className="text-sm text-content/50">5548 items available</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          className="flex-1 flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary py-3.5 rounded-xl font-semibold transition-colors border border-primary/20"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBuyNow}
          className="flex-1 bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl font-semibold transition-colors shadow-lg shadow-primary/10"
        >
          Buy Now
        </motion.button>
      </div>
    </motion.div>
  );
};
