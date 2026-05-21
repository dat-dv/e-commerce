"use client";

import Button from "@/components/atoms/button";
import { ShoppingBag, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { TYPOGRAPHY } from "@/constants/typography";
import { UI_RADIUS } from "@/constants/ui-radius";
import { TProduct } from "@/domain/products/types/products.model";
import { useAddToCart } from "@/hooks/cart/use-add-to-cart";
import { useToggleFavorite } from "@/hooks/favorites/use-toggle-favorite";
import { cn } from "@/utils/cn";
import { ProductCardInfo } from "./product-card-info";
import { ProductCardMedia } from "./product-card-media";
import { ProductCardPrice } from "./product-card-price";
import {
  getFormattedSoldCount,
  getProductBadgeText,
  getSkuPriceDisplay,
} from "./product-card.utils";

interface ProductCardProps {
  product: TProduct;
  showFavoriteButton?: boolean;
}

export const ProductCard = ({
  product,
  showFavoriteButton = true,
}: ProductCardProps) => {
  const t = useTranslations("Common.productCard");
  const addItem = useAddToCart();
  const {
    isFavorited,
    toggle: toggleFavorite,
    loading: favoriteLoading,
  } = useToggleFavorite(product.id, product.isFavorited);
  const sku = product?.skus?.[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const priceNumber = sku?.price || 0;

    addItem(
      {
        id: sku?.id || "",
        productId: String(product.id),
        skuId: sku?.id || "",
        name: product.name,
        price: priceNumber,
        originalPrice: sku?.originalPrice,
        discountPercent: sku?.discountPercent,
        imageUrl: product.imageUrl || sku?.imageUrl || "",
        attributes: product.category,
      },
      1,
    );
  };

  const badgeText = getProductBadgeText(product);

  const hasDiscount = !!sku?.discountPercent;
  const discountLabel = `-${sku?.discountPercent}%`;

  const hasRating = product.rating !== undefined && product.rating > 0;
  const formattedRating = product.rating?.toFixed(1);

  const formattedSoldCount = getFormattedSoldCount(product.soldCount);
  const priceDisplay = getSkuPriceDisplay(sku);

  return (
    <div
      className={cn(
        UI_RADIUS.card,
        "group bg-content/[0.02] border-content/[0.05] hover:border-content/[0.1] relative flex h-full flex-1 flex-col border p-3 transition-all duration-300 hover:shadow-xl hover:shadow-black/5",
      )}
    >
      <ProductCardMedia
        product={product}
        noImageLabel={t("noImage")}
        addToCartClassName="bg-primary text-surface hover:opacity-90"
        onAddToCart={handleAddToCart}
        showFavoriteButton={showFavoriteButton}
        isFavorited={isFavorited}
        favoriteLoading={favoriteLoading}
        onToggleFavorite={toggleFavorite}
        badges={
          hasDiscount ? (
            <div
              className={cn(
                UI_RADIUS.badge,
                `bg-red-500 text-white ${TYPOGRAPHY.badge} px-2 py-0.5 shadow-lg shadow-red-500/20`,
              )}
            >
              {discountLabel}
            </div>
          ) : undefined
        }
      />

      <ProductCardInfo
        product={product}
        badgeText={badgeText}
        titleHoverClassName="group-hover:text-primary"
      >
        <div className="mt-1 flex items-center gap-2">
          {hasRating && (
            <div
              className={`flex items-center gap-0.5 text-yellow-500 ${TYPOGRAPHY.badge}`}
            >
              <span>{formattedRating}</span>
              <Star className="h-2.5 w-2.5 fill-current" />
            </div>
          )}
          {formattedSoldCount && (
            <span className={`${TYPOGRAPHY.badge} text-content/30 font-normal`}>
              Đã bán {formattedSoldCount}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <ProductCardPrice
            price={priceDisplay.price}
            originalPrice={priceDisplay.originalPrice}
            hasOriginalPrice={priceDisplay.hasOriginalPrice}
            priceClassName="text-primary"
          />

          <Button
            onClick={handleAddToCart}
            variant="ghost"
            className={cn(
              UI_RADIUS.control,
              "text-content/20 hover:text-primary hover:bg-primary/10 border-content/5 flex h-9 w-9 items-center justify-center border p-0 lg:hidden",
            )}
          >
            <ShoppingBag size={18} />
          </Button>
        </div>
      </ProductCardInfo>
    </div>
  );
};
