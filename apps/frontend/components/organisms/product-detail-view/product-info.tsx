"use client";

import Button from "@/components/atoms/button";
import { formatCurrency } from "@/utils/format-currency";
import { motion } from "framer-motion";
import { Heart, Minus, Plus, ShoppingCart, Star } from "lucide-react";

import { TProduct, TSkuDomain } from "@/domain/products/types/products.model";

import { useTranslations } from "next-intl";

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
  const t = useTranslations("ProductDetailPage");
  const isDiscounted = originalPrice > price;
  const hasValidDiscountPercent = isDiscounted && discountPercent > 0;
  const parsedAttributeGroups = Object.entries(attributeGroups).map(
    ([name, valuesSet]) => ({
      name,
      values: Array.from(valuesSet),
    }),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="lg:col-span-8 flex flex-col gap-5"
    >
      {/* Product Title */}
      <h1 className="text-xl font-semibold text-content leading-snug">
        {name}
      </h1>

      {/* Rating, Reviews, Sold & Report */}
      <div className="flex items-center justify-between text-sm border-b border-content/[0.05] pb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="font-bold text-primary text-base">
              {rating.toFixed(1)}
            </span>
            <div className="flex text-primary">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < Math.floor(rating) ? "currentColor" : "none"}
                  className={i < Math.floor(rating) ? "" : "text-primary/20"}
                />
              ))}
            </div>
          </div>

          <div className="w-[1px] h-4 bg-content/[0.1]" />

          <div className="flex items-center gap-1">
            <span className="font-bold text-content">{reviewsCount}</span>
            <span className="text-content/50 text-xs">{t("reviews")}</span>
          </div>

          <div className="w-[1px] h-4 bg-content/[0.1]" />

          <div className="flex items-center gap-1">
            <span className="font-bold text-content">
              {product.soldCount || 0}
            </span>
            <span className="text-content/50 text-xs">{t("sold")}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          className="text-content/40 hover:text-content hover:bg-transparent text-xs font-medium transition-colors h-auto px-0 active:scale-100"
        >
          {t("report")}
        </Button>
      </div>

      {/* Price Box - Shopee Style */}
      <div className="bg-content/[0.02] p-4 rounded-xl flex items-center gap-4">
        {isDiscounted && (
          <span className="text-content/40 line-through text-base">
            {formatCurrency(originalPrice)}
          </span>
        )}
        <span className="text-3xl font-bold text-primary">
          {formatCurrency(price)}
        </span>
        {hasValidDiscountPercent && (
          <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-lg">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Dynamic Options */}
      {parsedAttributeGroups.map(({ name: attrName, values }) => (
        <div key={attrName} className="flex flex-col gap-3">
          <span className="text-sm font-medium text-content/60 w-24">
            {attrName}
          </span>
          <div className="flex flex-wrap gap-2">
            {values.map((value) => (
              <Button
                key={value}
                variant="ghost"
                onClick={() =>
                  setSelectedAttributes({
                    ...selectedAttributes,
                    [attrName]: value,
                  })
                }
                className={`px-4 py-2 h-auto rounded-lg border text-sm font-medium transition-all flex items-center gap-2 active:scale-[0.98] hover:opacity-100 ${
                  selectedAttributes[attrName] === value
                    ? "border-primary text-primary bg-primary/5 hover:bg-primary/5"
                    : "border-content/[0.1] hover:border-content/20 text-content/80 hover:bg-transparent"
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
              </Button>
            ))}
          </div>
        </div>
      ))}

      {/* Quantity & Stock */}
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-content/60 w-24">
          {t("quantity")}
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-content/[0.1] rounded-lg overflow-hidden h-9">
            <Button
              variant="ghost"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="h-full px-3 hover:bg-content/[0.05] transition-colors rounded-none border-r border-r-content/[0.1] active:scale-100 hover:opacity-100 text-content opacity-100 font-normal"
            >
              <Minus size={12} />
            </Button>
            <span className="px-4 font-semibold text-sm min-w-[40px] text-center">
              {quantity}
            </span>
            <Button
              variant="ghost"
              onClick={() => setQuantity(quantity + 1)}
              className="h-full px-3 hover:bg-content/[0.05] transition-colors rounded-none border-l border-l-content/[0.1] active:scale-100 hover:opacity-100 text-content opacity-100 font-normal"
            >
              <Plus size={12} />
            </Button>
          </div>
          <span className="text-sm text-content/50">
            {selectedSku?.stock !== undefined
              ? t("itemsAvailable", { count: String(selectedSku.stock) })
              : t("inStock")}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-2">
        <Button
          variant="outline"
          className="flex-1 py-3.5 h-auto bg-primary/10 hover:bg-primary/20 border-primary/20 hover:brightness-100"
          onClick={handleAddToCart}
          disabled={!selectedSku.id}
        >
          <ShoppingCart size={18} />
          {t("addToCart")}
        </Button>
        <Button
          variant="primary"
          className="flex-1 py-3.5 h-auto"
          onClick={handleBuyNow}
          disabled={!selectedSku.id}
        >
          {t("buyNow")}
        </Button>
        <Button
          variant="ghost"
          className={`flex items-center justify-center w-12 h-12 rounded-xl border transition-all px-0 ${
            isFavorited
              ? "bg-red-50 border-red-100 text-red-500 shadow-sm shadow-red-500/10"
              : "bg-content/[0.02] border-content/[0.08] text-content/40 hover:text-red-400 hover:border-red-100 hover:bg-red-50/30"
          }`}
          onClick={onToggleFavorite}
        >
          <Heart
            size={20}
            fill={isFavorited ? "currentColor" : "none"}
            className={isFavorited ? "animate-pulse-slow" : ""}
          />
        </Button>
      </div>
    </motion.div>
  );
};
