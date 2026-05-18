import { useState, useEffect, useMemo } from "react";
import {
  TGetProductReviewsRequest,
  TProduct,
  TSkuDomain,
} from "@/domain/products/types/products.model";
import { useSimilarProducts } from "./use-similar-products";
import { useProductReviews } from "./use-product-reviews";
import { useProductActions } from "./use-product-actions";

export const useProductDetail = (product: TProduct) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewFilter, setReviewFilter] = useState<TGetProductReviewsRequest>({
    page: 1,
    limit: 10,
    sort: "newest",
  });
  const fallbackSku = useMemo<TSkuDomain>(
    () => ({
      id: "",
      price: 0,
      unitPrice: "0",
      attributes: [],
      stock: 0,
    }),
    [],
  );

  // 1. Group attributes across all SKUs
  const attributeGroups = useMemo(() => {
    const groups: Record<string, Set<string>> = {};
    product.skus?.forEach((sku) => {
      sku.attributes?.forEach((attr) => {
        if (!groups[attr.name]) {
          groups[attr.name] = new Set();
        }
        groups[attr.name].add(attr.value);
      });
    });
    return groups;
  }, [product.skus]);

  // 2. Find selected SKU based on attributes
  const selectedSku = useMemo(() => {
    return (
      product.skus?.find((sku) => {
        return sku.attributes?.every(
          (attr) => selectedAttributes[attr.name] === attr.value,
        );
      }) ||
      product.skus?.[0] ||
      fallbackSku
    );
  }, [fallbackSku, product.skus, selectedAttributes]);

  // 3. Initialize selected attributes from first SKU
  useEffect(() => {
    if (product.skus?.[0]?.attributes) {
      const initialAttrs: Record<string, string> = {};
      product.skus[0].attributes.forEach((attr) => {
        initialAttrs[attr.name] = attr.value;
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedAttributes(initialAttrs);
    }
  }, [product.skus]);

  // 4. Collect all available images and deduplicate them
  const images = useMemo(() => {
    return Array.from(
      new Set(
        [
          product.imageUrl,
          ...(product.skus || []).map((sku) => sku.imageUrl),
        ].filter((img): img is string => !!img && typeof img === "string"),
      ),
    );
  }, [product.imageUrl, product.skus]);

  // 5. Fetch related data using adapter hooks
  const { reviews, totalReviews, loadingReviews } = useProductReviews(
    product.id,
    reviewFilter,
  );
  const { similarProducts, loadingSimilar } = useSimilarProducts(product.id);

  // 6. Action handlers
  const { handleAddToCart, handleBuyNow } = useProductActions(
    product,
    selectedSku,
    selectedAttributes,
    quantity,
    images[selectedImage],
  );

  return {
    // State
    quantity,
    setQuantity,
    selectedAttributes,
    setSelectedAttributes,
    selectedImage,
    setSelectedImage,

    // Derived Data
    attributeGroups,
    selectedSku,
    images,

    // Fetched Data
    reviews,
    totalReviews,
    loadingReviews,
    reviewFilter,
    setReviewFilter,
    similarProducts,
    loadingSimilar,

    // Actions
    handleAddToCart,
    handleBuyNow,
  };
};
