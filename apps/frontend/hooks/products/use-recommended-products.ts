import { useState, useEffect, useRef } from "react";
import { TProduct } from "@/domain/products/types/products.model";
import { productsUseCase } from "@/domain/products/use-cases";

export const useRecommendedProducts = () => {
  const isFetch = useRef(false);
  const [recommendedProducts, setRecommendedProducts] = useState<TProduct[]>(
    [],
  );
  const [loadingRecommended, setLoadingRecommended] = useState(true);

  useEffect(() => {
    if (isFetch.current) return;
    const fetchRecommended = async () => {
      isFetch.current = true;
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
