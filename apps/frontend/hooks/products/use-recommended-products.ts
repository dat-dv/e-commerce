import { useState, useEffect } from "react";
import { TProduct } from "@/domain/products/types/products.model";
import { productsUseCase } from "@/domain/products/use-cases";

export const useRecommendedProducts = () => {
  const [recommendedProducts, setRecommendedProducts] = useState<TProduct[]>(
    [],
  );
  const [loadingRecommended, setLoadingRecommended] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      setLoadingRecommended(true);
      try {
        const response = await productsUseCase.getRecommended.execute();
        if (response.data) {
          setRecommendedProducts(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch recommended products:", error);
      } finally {
        setLoadingRecommended(false);
      }
    };

    fetchRecommended();
  }, []);

  return { recommendedProducts, loadingRecommended };
};
