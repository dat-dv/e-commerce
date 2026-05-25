import { TProduct, TSkuDomain } from "@/domain/products/types/products.model";
import { useEffect, useMemo, useState } from "react";

const fallbackSku: TSkuDomain = {
  id: "",
  price: 0,
  unitPrice: "0",
  attributes: [],
  stock: 0,
  productId: "",
  skuCode: "",
};

const hasSkuAttributes = (skus: TProduct["skus"]) =>
  skus?.some((sku) => sku.attributes && sku.attributes.length > 0);

const getSkuAttributes = (sku?: TSkuDomain) =>
  sku?.attributes?.reduce<Record<string, string>>((attrs, attr) => {
    attrs[attr.name] = attr.value;
    return attrs;
  }, {}) || {};

const getInitialAttributes = (skus: TProduct["skus"]) => {
  return hasSkuAttributes(skus) ? getSkuAttributes(skus?.[0]) : {};
};

const findSkuByAttributes = (
  skus: TProduct["skus"],
  selectedAttributes: Record<string, string>,
) => {
  const selectedEntries = Object.entries(selectedAttributes);

  if (selectedEntries.length === 0) {
    return undefined;
  }

  return skus?.find((sku) =>
    selectedEntries.every(([name, value]) =>
      sku.attributes?.some(
        (attr) => attr.name === name && attr.value === value,
      ),
    ),
  );
};

export const useProductSelection = (product: TProduct) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSkuId, setSelectedSkuId] = useState(
    () => product.skus?.[0]?.id || "",
  );
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >(() => getInitialAttributes(product.skus));

  const attributeGroups = useMemo(() => {
    const groups: Record<string, Set<string>> = {};

    if (hasSkuAttributes(product.skus)) {
      product.skus?.forEach((sku) => {
        sku.attributes?.forEach((attr) => {
          if (!groups[attr.name]) {
            groups[attr.name] = new Set();
          }

          groups[attr.name].add(attr.value);
        });
      });
    }

    return groups;
  }, [product.skus]);

  const selectedSku = useMemo(
    () =>
      product.skus?.find((sku) => sku.id === selectedSkuId) ||
      product.skus?.[0] ||
      fallbackSku,
    [product.skus, selectedSkuId],
  );

  const shouldUseSkuSelector = useMemo(
    () => !hasSkuAttributes(product.skus) && (product.skus?.length || 0) > 1,
    [product.skus],
  );

  const handleSelectedSkuIdChange = (skuId: string) => {
    const sku = product.skus?.find((item) => item.id === skuId);
    setSelectedSkuId(skuId);

    if (hasSkuAttributes(product.skus)) {
      setSelectedAttributes(getSkuAttributes(sku));
    }
  };

  const handleSelectedAttributesChange = (attrs: Record<string, string>) => {
    const changedAttribute = Object.entries(attrs).find(
      ([name, value]) => selectedAttributes[name] !== value,
    );

    const matchingSku =
      findSkuByAttributes(product.skus, attrs) ||
      (changedAttribute
        ? product.skus?.find((sku) =>
            sku.attributes?.some(
              (attr) =>
                attr.name === changedAttribute[0] &&
                attr.value === changedAttribute[1],
            ),
          )
        : undefined);

    if (matchingSku) {
      setSelectedSkuId(matchingSku.id);
      setSelectedAttributes(getSkuAttributes(matchingSku));
      return;
    }

    setSelectedAttributes(attrs);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedAttributes(getInitialAttributes(product.skus));
    setSelectedSkuId(product.skus?.[0]?.id || "");
  }, [product.skus]);

  useEffect(() => {
    if (selectedSku) {
      const maxStock = selectedSku.stock ?? 0;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuantity(() => {
        if (maxStock === 0) return 0;
        return Math.min(1, maxStock);
      });
    }
  }, [selectedSku]);

  return {
    quantity,
    setQuantity,
    selectedAttributes,
    setSelectedAttributes: handleSelectedAttributesChange,
    selectedSkuId,
    setSelectedSkuId: handleSelectedSkuIdChange,
    attributeGroups,
    shouldUseSkuSelector,
    selectedSku,
  };
};
