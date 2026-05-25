import { IProductResponse, ISkuResponse } from "@ecommerce/shared";
import {
  TBrand,
  TBrandTranslation,
  TFlashSale,
  TImage,
  TProduct,
  TProductCategory,
  TProductCategoryTranslation,
  TProductTranslation,
  TSkuAttributeValue,
  TSkuDomain,
} from "../types/products.model";

type TFlashSaleResponse = NonNullable<
  NonNullable<ISkuResponse["flash_sales"]>[number]["flash_sale"]
>;

const toIsoString = (value?: Date | string | null) =>
  value ? new Date(value).toISOString() : undefined;

const mapImage = (
  image?: {
    id: string;
    url: string;
    public_id: string;
    width?: number | null;
    height?: number | null;
    format?: string | null;
    bytes?: number | null;
    created_at?: Date | string;
    updated_at?: Date | string;
  } | null,
): TImage | null =>
  image
    ? {
        id: image.id,
        url: image.url,
        publicId: image.public_id,
        width: image.width,
        height: image.height,
        format: image.format,
        bytes: image.bytes,
        createdAt: toIsoString(image.created_at),
        updatedAt: toIsoString(image.updated_at),
      }
    : null;

const mapBrandTranslation = (translation: {
  id: string;
  brand_id: string;
  language_id: string;
  name: string;
  description?: string | null;
  story?: string | null;
}): TBrandTranslation => ({
  id: translation.id,
  brandId: translation.brand_id,
  languageId: translation.language_id,
  name: translation.name,
  description: translation.description,
  story: translation.story,
});

const mapBrand = (brand?: IProductResponse["brand"]): TBrand | null => {
  if (!brand) return null;

  const translations = brand.translations?.map(mapBrandTranslation) || null;
  const selectedTranslation = translations?.[0];

  return {
    id: brand.id,
    slug: brand.slug,
    logoId: brand.logo_id,
    bannerId: brand.banner_id,
    logoUrl: brand.logo?.url || brand.logo_url || "",
    bannerUrl: brand.banner?.url || brand.banner_url || "",
    websiteUrl: brand.website_url,
    foundedYear: brand.founded_year,
    headquarters: brand.headquarters,
    isVerified: brand.is_verified,
    isFeatured: brand.is_featured,
    order: brand.order,
    createdAt: toIsoString(brand.created_at),
    updatedAt: toIsoString(brand.updated_at),
    name: selectedTranslation?.name || "No Name",
    description: selectedTranslation?.description || "",
    story: selectedTranslation?.story,
    logo: mapImage(brand.logo),
    banner: mapImage(brand.banner),
    translations,
    productCount: brand.product_count,
    storyEn: brand.story_en,
  };
};

const mapProductCategoryTranslation = (translation: {
  id: string;
  category_id: string;
  language_id: string;
  name: string;
  description?: string | null;
}): TProductCategoryTranslation => ({
  id: translation.id,
  categoryId: translation.category_id,
  languageId: translation.language_id,
  name: translation.name,
  description: translation.description,
});

const mapProductCategory = (
  category?: NonNullable<
    NonNullable<IProductResponse["categories"]>[number]["category"]
  >,
): TProductCategory | null => {
  if (!category) return null;

  const translations =
    category.translations?.map(mapProductCategoryTranslation) || null;
  const selectedTranslation = translations?.[0];

  return {
    id: category.id,
    slug: category.slug,
    parentId: category.parent_id,
    imageId: category.image_id,
    level: category.level,
    order: category.order,
    isActive: category.is_active,
    createdAt: toIsoString(category.created_at),
    updatedAt: toIsoString(category.updated_at),
    name: selectedTranslation?.name,
    description: selectedTranslation?.description,
    translations,
  };
};

const mapProductTranslation = (translation: {
  id: string;
  product_id: string;
  language_id: string;
  name: string;
  description?: string | null;
}): TProductTranslation => ({
  id: translation.id,
  productId: translation.product_id,
  languageId: translation.language_id,
  name: translation.name,
  description: translation.description,
});

const mapFlashSale = (flashSale?: TFlashSaleResponse): TFlashSale | null => {
  if (!flashSale) return null;

  return {
    id: flashSale.id,
    name: flashSale.name,
    startTime: toIsoString(flashSale.start_time) || "",
    endTime: toIsoString(flashSale.end_time) || "",
    timeSlotId: flashSale.time_slot_id,
    createdAt: toIsoString(flashSale.created_at),
    updatedAt: toIsoString(flashSale.updated_at),
  };
};

const mapSkuAttributeValue = (
  skuAttributeValue: NonNullable<ISkuResponse["sku_attribute_values"]>[number],
): TSkuAttributeValue => ({
  skuId: skuAttributeValue.sku_id,
  attributeValueId: skuAttributeValue.attribute_value_id,
  attributeValue: skuAttributeValue.attribute_value
    ? {
        id: skuAttributeValue.attribute_value.id,
        attributeId: skuAttributeValue.attribute_value.attribute_id,
        value: skuAttributeValue.attribute_value.value,
        attribute: skuAttributeValue.attribute_value.attribute
          ? {
              id: skuAttributeValue.attribute_value.attribute.id,
              name: skuAttributeValue.attribute_value.attribute.name,
            }
          : null,
      }
    : null,
});

const mapSku = (sku: ISkuResponse): TSkuDomain => {
  const flashSale = sku.flash_sales?.[0];
  const salePrice = flashSale?.sale_price;
  const regularPrice = sku.price;

  const displayPrice = salePrice || regularPrice || 0;
  const strikePrice =
    sku.original_price && sku.original_price > regularPrice
      ? sku.original_price
      : regularPrice || sku.original_price;

  const discountPercent =
    strikePrice && displayPrice && strikePrice > displayPrice
      ? Math.round(((strikePrice - displayPrice) / strikePrice) * 100)
      : undefined;

  const skuAttributeValuesMapped =
    sku.sku_attribute_values?.map(mapSkuAttributeValue) || null;

  return {
    id: sku.id,
    productId: sku.product_id,
    skuCode: sku.sku_code,
    price: displayPrice,
    unitPrice: sku.unit_price || "VND",
    originalPrice:
      strikePrice && displayPrice && strikePrice > displayPrice
        ? strikePrice
        : undefined,
    discountPercent,
    sold: flashSale?.sold_count,
    total: flashSale?.stock,
    stock: sku.stock,
    flashSaleStart: toIsoString(flashSale?.flash_sale?.start_time),
    flashSaleEnd: toIsoString(flashSale?.flash_sale?.end_time),
    imageUrl: sku.image_url || undefined,
    flashSales:
      sku.flash_sales?.map((fs) => ({
        id: fs.id,
        flashSaleId: fs.flash_sale_id,
        skuId: fs.sku_id,
        salePrice: fs.sale_price,
        stock: fs.stock,
        soldCount: fs.sold_count,
        orderLimit: fs.order_limit,
        flashSale: mapFlashSale(fs.flash_sale),
      })) || null,
    skuAttributeValues: skuAttributeValuesMapped,
    attributes:
      skuAttributeValuesMapped
        ?.filter((sav) => sav.attributeValue?.attribute)
        .map((sav) => ({
          name: sav.attributeValue?.attribute?.name || "Unknown",
          value: sav.attributeValue?.value || "Unknown",
        })) || [],
    product: sku.product ? ProductMapper.toDomain(sku.product) : null,
  };
};

export class ProductMapper {
  static toDomain(dto: IProductResponse): TProduct {
    const translation = dto.translations?.[0];
    const skus = dto.skus?.map(mapSku) || [];

    const categoryMapping = dto.categories?.[0];
    const categoryName =
      categoryMapping?.category?.translations?.[0]?.name ||
      categoryMapping?.category?.slug;

    const categoriesMapped = dto.categories
      ? dto.categories.map((c) => ({
          productId: c.product_id,
          categoryId: c.category_id,
          category: mapProductCategory(c.category),
        }))
      : null;

    return {
      id: String(dto.id),
      slug: dto.slug || String(dto.id),
      name: translation?.name || "No Name",
      description: translation?.description || "",
      category: categoryName || "General",
      imageUrl: dto.thumbnail?.url || skus[0]?.imageUrl || "",
      brand: mapBrand(dto.brand),
      skus,
      rating: dto.rating,
      soldCount: dto.sold_count,
      reviewCount: dto.review_count,
      isFavorited: dto.is_favorited,
      sellerId: dto.seller_id,
      brandId: dto.brand_id,
      status: dto.status,
      createdAt: toIsoString(dto.created_at),
      updatedAt: toIsoString(dto.updated_at),
      deletedAt: toIsoString(dto.deleted_at) || null,
      basePrice: dto.base_price,
      thumbnailId: dto.thumbnail_id,
      thumbnail: mapImage(dto.thumbnail),
      categories: categoriesMapped,
      translations: dto.translations?.map(mapProductTranslation) || null,
    };
  }
}
