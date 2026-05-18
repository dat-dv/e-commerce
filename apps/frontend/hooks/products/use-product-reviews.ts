import { useState, useEffect } from "react";
import {
  TGetProductReviewsRequest,
  TReview,
} from "@/domain/products/types/products.model";
import { productsUseCase } from "@/domain/products/use-cases";

const getReviewErrorMessage = (error: Error) => {
  return error.message || "Reviews could not be loaded. Please try again.";
};

export const useProductReviews = (
  productId: string,
  params?: TGetProductReviewsRequest,
) => {
  const [reviews, setReviews] = useState<TReview[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoadingReviews(true);
      setReviewError(null);
      try {
        const response = await productsUseCase.getProductReviews.execute(
          productId,
          params,
        );
        if (response.data) {
          setReviews(response.data.items);
          setTotalReviews(response.data.meta.total);
        }
      } catch (error) {
        setReviews([]);
        setTotalReviews(0);
        setReviewError(
          getReviewErrorMessage(
            error instanceof Error
              ? error
              : new Error("Reviews could not be loaded. Please try again."),
          ),
        );
      } finally {
        setLoadingReviews(false);
      }
    };

    if (productId) {
      fetchReviews();
    }
  }, [params, productId, refreshKey]);

  return {
    reviews,
    totalReviews,
    loadingReviews,
    reviewError,
    refetchReviews: () => setRefreshKey((key) => key + 1),
  };
};
