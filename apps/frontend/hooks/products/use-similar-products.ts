import { DEFAULT_PAGE_SIZE } from "@/config/pagination.confg";
import { TProduct } from "@/domain/products/types/products.model";
import { productsUseCase } from "@/domain/products/use-cases";
import { useEffect, useState } from "react";

export const useSimilarProducts = (productId: string) => {
  const [similarProducts, setSimilarProducts] = useState<TProduct[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      setLoadingSimilar(true);
      try {
        const response = await productsUseCase.getSimilarProducts.execute(
          productId,
          DEFAULT_PAGE_SIZE,
        );
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
