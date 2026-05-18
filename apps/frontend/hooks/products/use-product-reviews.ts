import { useState, useEffect } from "react";
import {
  TGetProductReviewsRequest,
  TReview,
} from "@/domain/products/types/products.model";
import { productsUseCase } from "@/domain/products/use-cases";

export const useProductReviews = (
  productId: string,
  params?: TGetProductReviewsRequest,
) => {
  const [reviews, setReviews] = useState<TReview[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoadingReviews(true);
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
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoadingReviews(false);
      }
    };

    if (productId) {
      fetchReviews();
    }
  }, [params, productId]);

  return { reviews, totalReviews, loadingReviews };
};
