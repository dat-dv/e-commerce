"use client";

import { useCartStore } from "@/hooks/cart/use-cart-store";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { APP_ROUTES, CALLBACK_URL_KEY } from "@/constants/routes";
import { useState, useEffect } from "react";
import { TProduct, TReview } from "@/domain/products/types/products.model";
import { productsUseCase } from "@/domain/products/use-cases";
import { ProductImages } from "./product-images";
import { ProductInfo } from "./product-info";
import { BrandInfo } from "./brand-info";
import { DescriptionCategory } from "./description-category";
import { ReviewsRatings } from "./reviews-ratings";
import { SimilarProducts } from "./similar-products";
import { Recommendations } from "./recommendations";

export interface ProductDetailProps {
  product: TProduct;
}

export default function ProductDetailClient({ product }: ProductDetailProps) {
  const addItem = useCartStore((s) => s.addItem);

  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string;
  }>({});

  const [reviews, setReviews] = useState<TReview[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [similarProducts, setSimilarProducts] = useState<TProduct[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<TProduct[]>(
    [],
  );
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [loadingSimilar, setLoadingSimilar] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(true);

  // Group attributes across all SKUs
  const attributeGroups: { [key: string]: Set<string> } = {};

  product.skus.forEach((sku, idx) => {
    sku.attributes?.forEach((attr) => {
      if (!attributeGroups[attr.name]) {
        attributeGroups[attr.name] = new Set();
      }
      attributeGroups[attr.name].add(attr.value);
    });
  });

  // Find selected SKU based on attributes
  const selectedSku =
    product.skus.find((sku) => {
      return sku.attributes?.every(
        (attr) => selectedAttributes[attr.name] === attr.value,
      );
    }) || product.skus[0];

  // Initialize selected attributes from first SKU
  useEffect(() => {
    if (product.skus[0]?.attributes) {
      const initialAttrs: { [key: string]: string } = {};
      product.skus[0].attributes.forEach((attr) => {
        initialAttrs[attr.name] = attr.value;
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedAttributes(initialAttrs);
    }
  }, [product.skus]);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const response = await productsUseCase.getProductReviews.execute(
          product.id,
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

    const fetchSimilar = async () => {
      setLoadingSimilar(true);
      try {
        const response = await productsUseCase.getSimilarProducts.execute(
          product.id,
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

    fetchReviews();
    fetchSimilar();
    fetchRecommended();
  }, [product.id]);

  // Collect all available images
  const images = [
    product.image_url,
    ...product.skus.map((sku) => sku.image_url).filter(Boolean),
  ].filter((img): img is string => typeof img === "string");

  const [selectedImage, setSelectedImage] = useState(0);

  // Use specific dummy data or real data
  const name =
    product.name ||
    "Tai nghe Bluetooth cổ điển Q86 không dây, hiệu ứng âm thanh nổi hifi, micrô tích hợp, cuộc gọi thoại độ phân giải cao";
  const price = selectedSku.price || 0;
  const originalPrice = selectedSku.original_price || 0;
  const discountPercent = selectedSku.discount_percent || 0;

  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const handleAddToCart = () => {
    if (!user) {
      toast.info("Please sign in to perform this action", {
        toastId: "auth-required",
      });
      const callbackUrl = encodeURIComponent(window.location.pathname);
      router.push(`${APP_ROUTES.SIGN_IN}?${CALLBACK_URL_KEY}=${callbackUrl}`);
      return;
    }

    if (!selectedSku) return;

    addItem(
      {
        id: selectedSku.id,
        product_id: product.id,
        sku_id: selectedSku.id,
        name: name,
        price: price,
        image_url: images[selectedImage] || product.image_url || "",
        attributes: Object.entries(selectedAttributes)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", "),
      },
      quantity,
    );
    toast.success("Added to cart successfully");
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.info("Please sign in to buy items");
      const callbackUrl = encodeURIComponent(window.location.pathname);
      router.push(`${APP_ROUTES.SIGN_IN}?${CALLBACK_URL_KEY}=${callbackUrl}`);
      return;
    }

    handleAddToCart();
    router.push(APP_ROUTES.CART);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-12">
      {/* SECTION 1: TOP GRID (Image & Info) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-surface border border-content/[0.05] rounded-3xl p-6 shadow-sm">
        <ProductImages
          images={images}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          name={name}
        />

        <ProductInfo
          name={name}
          originalPrice={originalPrice}
          price={price}
          discountPercent={discountPercent}
          rating={product.rating}
          reviewsCount={totalReviews}
          attributeGroups={attributeGroups}
          selectedAttributes={selectedAttributes}
          setSelectedAttributes={setSelectedAttributes}
          quantity={quantity}
          setQuantity={setQuantity}
          handleAddToCart={handleAddToCart}
          handleBuyNow={handleBuyNow}
        />
      </div>

      {/* SECTION 2: BRAND INFO */}
      <BrandInfo brand={product.brand} />

      {/* SECTION 3: DESCRIPTION & CATEGORY MERGED */}
      <DescriptionCategory
        name={name}
        category={product.category}
        description={product.description}
      />

      {/* SECTION 4: REVIEWS & RATINGS */}
      <ReviewsRatings
        reviews={reviews}
        loadingReviews={loadingReviews}
        averageRating={product.rating}
        totalReviews={totalReviews}
      />

      {/* SECTION 5: SIMILAR PRODUCTS */}
      <SimilarProducts
        similarProducts={similarProducts}
        loadingSimilar={loadingSimilar}
      />

      {/* SECTION 6: RECOMMENDATIONS */}
      <Recommendations
        recommendedProducts={recommendedProducts}
        loadingRecommended={loadingRecommended}
      />
    </div>
  );
}
