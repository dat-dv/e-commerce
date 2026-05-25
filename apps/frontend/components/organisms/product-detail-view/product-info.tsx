"use client";

import { motion } from "framer-motion";

import LiquidWaveText from "@/components/atoms/liquid-wave-text";
import { RenderDesktopOnly } from "@/components/molecules/responsive";
import { TProduct, TSkuDomain } from "@/domain/products/types/products.model";
import { ProductAttributeOptions } from "./product-attribute-options";
import { ProductFlashSaleBanner } from "./product-flash-sale-banner";
import { ProductPriceBox } from "./product-price-box";
import { ProductPurchaseActions } from "./product-purchase-actions";
import { ProductQuantitySelector } from "./product-quantity-selector";
import { ProductRatingSummary } from "./product-rating-summary";
import { ProductSkuOptions } from "./product-sku-options";

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
  selectedSkuId: string;
  setSelectedSkuId: (skuId: string) => void;
  shouldUseSkuSelector: boolean;
  quantity: number;
  setQuantity: (q: number) => void;
  handleAddToCart: () => void;
  handleBuyNow: () => void;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
  isFlashSaleActive?: boolean;
  flashSaleEnd?: string;
  flashSaleSold?: number;
  flashSaleTotal?: number;
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
  selectedSkuId,
  setSelectedSkuId,
  shouldUseSkuSelector,
  quantity,
  setQuantity,
  handleAddToCart,
  handleBuyNow,
  isFavorited = false,
  onToggleFavorite,
  isFlashSaleActive = false,
  flashSaleEnd,
  flashSaleSold = 0,
  flashSaleTotal = 0,
}: ProductInfoProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex flex-col gap-5 lg:col-span-8"
    >
      <LiquidWaveText
        enableSelection
        className="text-lg leading-tight font-bold tracking-tight"
      >
        {name}
      </LiquidWaveText>

      <ProductRatingSummary
        product={product}
        rating={rating}
        reviewsCount={reviewsCount}
      />

      {isFlashSaleActive && (
        <ProductFlashSaleBanner
          endTime={flashSaleEnd}
          soldCount={flashSaleSold}
          totalStock={flashSaleTotal}
        />
      )}

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

      {shouldUseSkuSelector && (
        <ProductSkuOptions
          skus={product.skus}
          selectedSkuId={selectedSkuId}
          onSelectedSkuChange={setSelectedSkuId}
        />
      )}

      <ProductQuantitySelector
        selectedSku={selectedSku}
        quantity={quantity}
        onQuantityChange={setQuantity}
      />

      <RenderDesktopOnly>
        <ProductPurchaseActions
          hasSelectedSku={Boolean(selectedSku.id)}
          isOutOfStock={selectedSku?.stock === 0}
          isFavorited={isFavorited}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onToggleFavorite={onToggleFavorite}
        />
      </RenderDesktopOnly>
    </motion.div>
  );
};
