import { useEffect, useMemo, useState } from "react";
import { TProduct, TSkuDomain } from "@/domain/products/types/products.model";

const fallbackSku: TSkuDomain = {
  id: "",
  price: 0,
  unitPrice: "0",
  attributes: [],
  stock: 0,
};

const getInitialAttributes = (skus: TProduct["skus"]) => {
  const initialAttrs: Record<string, string> = {};

  skus?.[0]?.attributes?.forEach((attr) => {
    initialAttrs[attr.name] = attr.value;
  });

  return initialAttrs;
};

export const useProductSelection = (product: TProduct) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >(() => getInitialAttributes(product.skus));

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

  const selectedSku = useMemo(() => {
    return (
      product.skus?.find((sku) =>
        sku.attributes?.every(
          (attr) => selectedAttributes[attr.name] === attr.value,
        ),
      ) ||
      product.skus?.[0] ||
      fallbackSku
    );
  }, [product.skus, selectedAttributes]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedAttributes(getInitialAttributes(product.skus));
  }, [product.skus]);

  return {
    quantity,
    setQuantity,
    selectedAttributes,
    setSelectedAttributes,
    attributeGroups,
    selectedSku,
  };
};
