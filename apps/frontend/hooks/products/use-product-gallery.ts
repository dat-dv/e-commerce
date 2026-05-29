import { TProduct } from "@/domain/products/types/products.model";
import { useEffect, useMemo, useState } from "react";

export const useProductGallery = (product: TProduct) => {
  const [selectedImage, setSelectedImage] = useState(0);

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

  useEffect(() => {
    if (selectedImage >= images.length) {
      setSelectedImage(0);
    }
  }, [images.length, selectedImage]);

  return {
    selectedImage,
    setSelectedImage,
    images,
    selectedImageUrl: images[selectedImage],
  };
};
