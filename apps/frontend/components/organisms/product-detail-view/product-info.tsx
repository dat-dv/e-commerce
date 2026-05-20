"use client";

import { motion } from "framer-motion";

import { TProduct, TSkuDomain } from "@/domain/products/types/products.model";
import { ProductAttributeOptions } from "./product-attribute-options";
import { ProductPriceBox } from "./product-price-box";
import { ProductPurchaseActions } from "./product-purchase-actions";
import { ProductQuantitySelector } from "./product-quantity-selector";
import { ProductRatingSummary } from "./product-rating-summary";

interface ProductInfoProps {
  product: TProduct;
  selectedSku: TSkuDomain;
  name: string;
  originalPrice: number;
  price: number;
  discountPercent: number;
  rating?: number;
  reviewsCount?: number;
  attributeGroups: Record<string, Set<string>>;
  selectedAttributes: Record<string, string>;
  setSelectedAttributes: (attrs: Record<string, string>) => void;
  quantity: number;
  setQuantity: (q: number) => void;
  handleAddToCart: () => void;
  handleBuyNow: () => void;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
}

export const ProductInfo = ({
  product,
  selectedSku,
  name,
  originalPrice,
  price,
  discountPercent,
  rating = 0,
  reviewsCount = 0,
  attributeGroups,
  selectedAttributes,
  setSelectedAttributes,
  quantity,
  setQuantity,
  handleAddToCart,
  handleBuyNow,
  isFavorited = false,
  onToggleFavorite,
}: ProductInfoProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="lg:col-span-8 flex flex-col gap-5"
    >
      <h1 className="text-xl font-semibold text-content leading-snug">
        {name}
      </h1>

      <ProductRatingSummary
        product={product}
        rating={rating}
        reviewsCount={reviewsCount}
      />

      <ProductPriceBox
        originalPrice={originalPrice}
        price={price}
        discountPercent={discountPercent}
      />

      <ProductAttributeOptions
        attributeGroups={attributeGroups}
        selectedAttributes={selectedAttributes}
        onSelectedAttributesChange={setSelectedAttributes}
      />

      <ProductQuantitySelector
        selectedSku={selectedSku}
        quantity={quantity}
        onQuantityChange={setQuantity}
      />

      <ProductPurchaseActions
        hasSelectedSku={Boolean(selectedSku.id)}
        isFavorited={isFavorited}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onToggleFavorite={onToggleFavorite}
      />
    </motion.div>
  );
};
