import { useState, useEffect } from "react";
import { TProduct } from "@/domain/products/types/products.model";
import { productsUseCase } from "@/domain/products/use-cases";

export const useSimilarProducts = (productId: string) => {
  const [similarProducts, setSimilarProducts] = useState<TProduct[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      setLoadingSimilar(true);
      try {
        const response =
          await productsUseCase.getSimilarProducts.execute(productId);
        if (response.data) {
          setSimilarProducts(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch similar products:", error);
      } finally {
        setLoadingSimilar(false);
      }
    };

    if (productId) {
      fetchSimilar();
    }
  }, [productId]);

  return { similarProducts, loadingSimilar };
};
