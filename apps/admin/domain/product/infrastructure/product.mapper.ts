import type {
  IAttributeListResponse,
  IAttributeResponse,
  IBrandResponse,
  ICategoryResponse,
  ICategoryTreeResponse,
  IProductListResponse,
  IProductResponse,
  ISkuResponse,
} from "@ecommerce/shared";

import type { ApiListResponse } from "@/utils/request";

import type {
  IAdminAttribute,
  IAdminBrand,
  IAdminCategory,
  IAdminFlashSale,
  IAdminFlashSaleProduct,
  IAdminProduct,
  IAdminProductCategoryMapping,
  IAdminProductImage,
  IAdminProductTranslation,
  IAdminSku,
  IAdminSkuAttributeValue,
} from "../types/product.model";

const toIsoString = (value?: Date | string | null) =>
  value ? new Date(value).toISOString() : undefined;

export class AdminProductMapper {
  static imageToDomain(
    image?: IProductResponse["thumbnail"],
  ): IAdminProductImage | null {
    if (!image) return null;

    return {
      id: image.id,
      url: image.url,
      publicId: image.public_id,
      width: image.width,
      height: image.height,
      format: image.format,
      bytes: image.bytes,
      createdAt: toIsoString(image.created_at),
      updatedAt: toIsoString(image.updated_at),
    };
  }

  static brandToDomain(brand: IBrandResponse): IAdminBrand {
    return {
      id: brand.id,
      slug: brand.slug,
      logoId: brand.logo_id,
      bannerId: brand.banner_id,
      logoUrl: brand.logo_url,
      bannerUrl: brand.banner_url,
      websiteUrl: brand.website_url,
      foundedYear: brand.founded_year,
      headquarters: brand.headquarters,
      isVerified: brand.is_verified,
      isFeatured: brand.is_featured,
      order: brand.order,
      createdAt: toIsoString(brand.created_at),
      updatedAt: toIsoString(brand.updated_at),
      translations: brand.translations?.map((translation) => ({
        id: translation.id,
        brandId: translation.brand_id,
        languageId: translation.language_id,
        name: translation.name,
        description: translation.description,
      })),
      logo: AdminProductMapper.imageToDomain(brand.logo),
      banner: AdminProductMapper.imageToDomain(brand.banner),
      productCount: brand.product_count,
      storyEn: brand.story_en,
    };
  }

  static categoryToDomain(category: ICategoryResponse): IAdminCategory {
    return {
      id: category.id,
      slug: category.slug,
      parentId: category.parent_id,
      imageId: category.image_id,
      level: category.level,
      isActive: category.is_active,
      order: category.order,
      createdAt: toIsoString(category.created_at),
      updatedAt: toIsoString(category.updated_at),
      translations: category.translations?.map((translation) => ({
        id: translation.id,
        categoryId: translation.category_id,
        languageId: translation.language_id,
        name: translation.name,
        description: translation.description,
      })),
      children: category.children?.map((child) =>
        AdminProductMapper.categoryToDomain(child),
      ),
    };
  }

  static categoryTreeToDomain(
    categoryTree: ICategoryTreeResponse,
  ): IAdminCategory[] {
    return categoryTree.map((category) =>
      AdminProductMapper.categoryToDomain(category),
    );
  }

  static attributeToDomain(attribute: IAttributeResponse): IAdminAttribute {
    return {
      id: attribute.id,
      name: attribute.name,
      values: attribute.values?.map((value) => ({
        id: value.id,
        attributeId: value.attribute_id,
        value: value.value,
      })),
    };
  }

  static attributeListToDomain(
    attributes: IAttributeListResponse,
  ): IAdminAttribute[] {
    return attributes.map((attribute) =>
      AdminProductMapper.attributeToDomain(attribute),
    );
  }

  static productToDomain(product: IProductResponse): IAdminProduct {
    return {
      id: product.id,
      slug: product.slug,
      sellerId: product.seller_id,
      brandId: product.brand_id,
      status: product.status,
      soldCount: product.sold_count,
      reviewCount: product.review_count,
      rating: product.rating,
      createdAt: toIsoString(product.created_at) ?? "",
      updatedAt: toIsoString(product.updated_at) ?? "",
      deletedAt: toIsoString(product.deleted_at) ?? null,
      basePrice: product.base_price,
      thumbnailId: product.thumbnail_id,
      translations: product.translations?.map(
        (translation): IAdminProductTranslation => ({
          id: translation.id,
          productId: translation.product_id,
          languageId: translation.language_id,
          name: translation.name,
          description: translation.description,
        }),
      ),
      thumbnail: AdminProductMapper.imageToDomain(product.thumbnail),
      brand: product.brand
        ? AdminProductMapper.brandToDomain(product.brand)
        : product.brand,
      categories: product.categories?.map(
        (mapping): IAdminProductCategoryMapping => ({
          productId: mapping.product_id,
          categoryId: mapping.category_id,
          category: mapping.category
            ? AdminProductMapper.categoryToDomain(mapping.category)
            : undefined,
        }),
      ),
      skus: product.skus?.map((sku) => AdminProductMapper.skuToDomain(sku)),
      isFavorited: product.is_favorited,
    };
  }

  static productListToDomain(
    productList: IProductListResponse,
  ): ApiListResponse<IAdminProduct> {
    return {
      items: productList.items.map((product) =>
        AdminProductMapper.productToDomain(product),
      ),
      meta: productList.meta,
    };
  }

  static skuToDomain(sku: ISkuResponse): IAdminSku {
    return {
      id: sku.id,
      productId: sku.product_id,
      skuCode: sku.sku_code,
      price: sku.price,
      originalPrice: sku.original_price,
      stock: sku.stock,
      imageUrl: sku.image_url,
      unitPrice: sku.unit_price,
      flashSales: sku.flash_sales?.map(
        (flashSaleProduct): IAdminFlashSaleProduct => ({
          id: flashSaleProduct.id,
          flashSaleId: flashSaleProduct.flash_sale_id,
          skuId: flashSaleProduct.sku_id,
          salePrice: flashSaleProduct.sale_price,
          stock: flashSaleProduct.stock,
          soldCount: flashSaleProduct.sold_count,
          flashSale: flashSaleProduct.flash_sale
            ? ({
                id: flashSaleProduct.flash_sale.id,
                name: flashSaleProduct.flash_sale.name,
                startTime: toIsoString(flashSaleProduct.flash_sale.start_time),
                endTime: toIsoString(flashSaleProduct.flash_sale.end_time),
                createdAt: toIsoString(flashSaleProduct.flash_sale.created_at),
                updatedAt: toIsoString(flashSaleProduct.flash_sale.updated_at),
              } satisfies IAdminFlashSale)
            : undefined,
        }),
      ),
      skuAttributeValues: sku.sku_attribute_values?.map(
        (item): IAdminSkuAttributeValue => ({
          skuId: item.sku_id,
          attributeValueId: item.attribute_value_id,
          attributeValue: item.attribute_value
            ? {
                id: item.attribute_value.id,
                attributeId: item.attribute_value.attribute_id,
                value: item.attribute_value.value,
                attribute: item.attribute_value.attribute
                  ? {
                      id: item.attribute_value.attribute.id,
                      name: item.attribute_value.attribute.name,
                    }
                  : undefined,
              }
            : undefined,
        }),
      ),
      product: sku.product
        ? AdminProductMapper.productToDomain(sku.product)
        : undefined,
    };
  }
}
