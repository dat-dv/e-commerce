import { TGetProductReviewsRequest } from "@/domain/products/types/products.model";
import { useState } from "react";
import { useProductReviews } from "./use-product-reviews";

const defaultReviewFilter: TGetProductReviewsRequest = {
  page: 1,
  limit: 10,
  sort: "newest",
};

type UseProductReviewSectionParams = {
  productId: string;
};

export const useProductReviewSection = ({
  productId,
}: UseProductReviewSectionParams) => {
  const [reviewFilter, setReviewFilter] =
    useState<TGetProductReviewsRequest>(defaultReviewFilter);

  const { reviews, totalReviews, loadingReviews, reviewError, refetchReviews } =
    useProductReviews(productId, reviewFilter);

  return {
    reviews,
    totalReviews,
    loadingReviews,
    reviewError,
    refetchReviews,
    reviewFilter,
    setReviewFilter,
  };
};
