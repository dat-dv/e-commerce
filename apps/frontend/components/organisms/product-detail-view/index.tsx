"use client";

import AppContainer from "@/components/atoms/app-container";
import { useProductDetail } from "@/hooks/products/use-product-detail";
import { TProduct } from "@/domain/products/types/products.model";
import { ProductImages } from "./product-images";
import { ProductInfo } from "./product-info";
import { BrandInfo } from "./brand-info";
import { DescriptionCategory } from "./description-category";
import { ReviewsRatings } from "./reviews-ratings";
import { SimilarProducts } from "./similar-products";
import { DiscoveryCarouselSection } from "@/components/organisms/discovery-sections";

import { useUserFavoriteProducts } from "@/hooks/user-favorite-products/use-user-favorite-products";

export interface ProductDetailProps {
  product: TProduct;
}

export default function ProductDetailClient({ product }: ProductDetailProps) {
  const { isFavorited, toggleFavorite } = useUserFavoriteProducts(
    product.isFavorited,
  );
  const {
    quantity,
    setQuantity,
    selectedAttributes,
    setSelectedAttributes,
    selectedImage,
    setSelectedImage,
    attributeGroups,
    selectedSku,
    images,
    reviews,
    totalReviews,
    loadingReviews,
    similarProducts,
    loadingSimilar,
    handleAddToCart,
    handleBuyNow,
  } = useProductDetail(product);

  const name = product.name;
  const price = selectedSku?.price || 0;
  const originalPrice = selectedSku?.originalPrice || 0;
  const discountPercent = selectedSku?.discountPercent || 0;

  return (
    <AppContainer className="py-8 space-y-12">
      {/* SECTION 1: TOP GRID (Image & Info) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-surface border border-content/[0.05] rounded-3xl p-6 shadow-sm">
        <ProductImages
          images={images}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          name={name}
        />

        <ProductInfo
          product={product}
          selectedSku={selectedSku}
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
          isFavorited={isFavorited}
          onToggleFavorite={() => toggleFavorite(product.id)}
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

      {/* SECTION 6: DISCOVERY SECTIONS */}
      <DiscoveryCarouselSection />
    </AppContainer>
  );
}
