import { useState } from "react";
import { TGetProductReviewsRequest } from "@/domain/products/types/products.model";
import { useProductReviews } from "./use-product-reviews";
import { useSubmitProductReview } from "./use-submit-product-review";

const defaultReviewFilter: TGetProductReviewsRequest = {
  page: 1,
  limit: 10,
  sort: "newest",
};

type UseProductReviewSectionParams = {
  productId: string;
  skuId?: string;
};

export const useProductReviewSection = ({
  productId,
  skuId,
}: UseProductReviewSectionParams) => {
  const [reviewFilter, setReviewFilter] =
    useState<TGetProductReviewsRequest>(defaultReviewFilter);

  const { reviews, totalReviews, loadingReviews, reviewError, refetchReviews } =
    useProductReviews(productId, reviewFilter);

  const reviewForm = useSubmitProductReview({
    productId,
    skuId,
    onSubmitted: () => {
      setReviewFilter((current) => ({
        ...current,
        page: 1,
        sort: "newest",
      }));
      refetchReviews();
    },
  });

  return {
    reviews,
    totalReviews,
    loadingReviews,
    reviewError,
    refetchReviews,
    reviewForm,
    reviewFilter,
    setReviewFilter,
  };
};
