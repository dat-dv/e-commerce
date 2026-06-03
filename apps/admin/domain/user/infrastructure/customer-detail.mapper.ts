import type {
  ICartResponse,
  IOrderResponse,
  IProductResponse,
  ISkuResponse,
  IUserFavoriteProductResponse,
} from "@ecommerce/shared";

import type {
  IAdminCustomerCart,
  IAdminCustomerCartItem,
  IAdminCustomerFavoriteProduct,
  IAdminCustomerOrder,
  IAdminImage,
  IAdminOrderItem,
  IAdminProduct,
  IAdminSku,
} from "../types/user.model";

const toIsoString = (date?: Date | string | null): string =>
  date ? new Date(date).toISOString() : "";

const imageToDomain = (
  image: IProductResponse["thumbnail"] | undefined,
): IAdminImage | null | undefined =>
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
    : image;

const productToDomain = (
  product: IProductResponse | undefined,
): IAdminProduct | undefined =>
  product
    ? {
        id: product.id,
        slug: product.slug,
        sellerId: product.seller_id,
        brandId: product.brand_id,
        status: product.status,
        soldCount: product.sold_count,
        reviewCount: product.review_count,
        rating: product.rating,
        createdAt: toIsoString(product.created_at),
        updatedAt: toIsoString(product.updated_at),
        deletedAt: toIsoString(product.deleted_at),
        basePrice: product.base_price,
        thumbnailId: product.thumbnail_id,
        thumbnail: imageToDomain(product.thumbnail),
        translations: product.translations?.map((translation) => ({
          id: translation.id,
          productId: translation.product_id,
          languageId: translation.language_id,
          name: translation.name,
          description: translation.description,
        })),
        brand: product.brand
          ? {
              id: product.brand.id,
              slug: product.brand.slug,
              logoId: product.brand.logo_id,
              bannerId: product.brand.banner_id,
              logoUrl: product.brand.logo_url,
              bannerUrl: product.brand.banner_url,
              websiteUrl: product.brand.website_url,
              foundedYear: product.brand.founded_year,
              headquarters: product.brand.headquarters,
              isVerified: product.brand.is_verified,
              isFeatured: product.brand.is_featured,
              order: product.brand.order,
              createdAt: toIsoString(product.brand.created_at),
              updatedAt: toIsoString(product.brand.updated_at),
              translations: product.brand.translations?.map((translation) => ({
                id: translation.id,
                brandId: translation.brand_id,
                languageId: translation.language_id,
                name: translation.name,
                description: translation.description,
                story: translation.story,
              })),
              logo: imageToDomain(product.brand.logo),
              banner: imageToDomain(product.brand.banner),
              productCount: product.brand.product_count,
              storyEn: product.brand.story_en,
            }
          : product.brand,
        categories: product.categories?.map((mapping) => ({
          productId: mapping.product_id,
          categoryId: mapping.category_id,
          category: mapping.category
            ? {
                id: mapping.category.id,
                slug: mapping.category.slug,
                imageId: mapping.category.image_id,
                parentId: mapping.category.parent_id,
                level: mapping.category.level,
                order: mapping.category.order,
                isActive: mapping.category.is_active,
                createdAt: toIsoString(mapping.category.created_at),
                updatedAt: toIsoString(mapping.category.updated_at),
                translations: mapping.category.translations?.map(
                  (translation) => ({
                    id: translation.id,
                    categoryId: translation.category_id,
                    languageId: translation.language_id,
                    name: translation.name,
                    description: translation.description,
                  }),
                ),
              }
            : undefined,
        })),
        skus: product.skus
          ?.map((sku) => skuToDomain(sku))
          .filter((sku): sku is IAdminSku => Boolean(sku)),
        isFavorited: product.is_favorited,
      }
    : undefined;

const skuToDomain = (sku: ISkuResponse | undefined): IAdminSku | undefined =>
  sku
    ? {
        id: sku.id,
        productId: sku.product_id,
        skuCode: sku.sku_code,
        price: sku.price,
        originalPrice: sku.original_price,
        stock: sku.stock,
        imageUrl: sku.image_url,
        unitPrice: sku.unit_price,
        flashSales: sku.flash_sales?.map((flashSaleProduct) => ({
          id: flashSaleProduct.id,
          flashSaleId: flashSaleProduct.flash_sale_id,
          skuId: flashSaleProduct.sku_id,
          salePrice: flashSaleProduct.sale_price,
          stock: flashSaleProduct.stock,
          soldCount: flashSaleProduct.sold_count,
          orderLimit: flashSaleProduct.order_limit,
          flashSale: flashSaleProduct.flash_sale
            ? {
                id: flashSaleProduct.flash_sale.id,
                name: flashSaleProduct.flash_sale.name,
                startTime: toIsoString(flashSaleProduct.flash_sale.start_time),
                endTime: toIsoString(flashSaleProduct.flash_sale.end_time),
                createdAt: toIsoString(flashSaleProduct.flash_sale.created_at),
                updatedAt: toIsoString(flashSaleProduct.flash_sale.updated_at),
                timeSlotId: flashSaleProduct.flash_sale.time_slot_id,
              }
            : undefined,
        })),
        skuAttributeValues: sku.sku_attribute_values?.map((item) => ({
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
        })),
        product: productToDomain(sku.product),
      }
    : undefined;

export const AdminCustomerDetailMapper = {
  orderToDomain(dto: IOrderResponse): IAdminCustomerOrder {
    return {
      id: dto.id,
      userId: dto.user_id,
      status: dto.status,
      totalAmount: dto.total_amount,
      discountAmount: dto.discount_amount,
      shippingAddressId: dto.shipping_address_id ?? null,
      couponId: dto.coupon_id,
      createdAt: toIsoString(dto.created_at),
      updatedAt: toIsoString(dto.updated_at),
      items: dto.items?.map(
        (item): IAdminOrderItem => ({
          id: item.id,
          orderId: item.order_id,
          skuId: item.sku_id,
          flashSaleId: item.flash_sale_id,
          quantity: item.quantity,
          price: item.price,
          snapshot: item.snapshot,
          sku: skuToDomain(item.sku),
        }),
      ),
      shippingAddress: dto.shipping_address
        ? {
            id: dto.shipping_address.id,
            userId: dto.shipping_address.user_id,
            receiverName: dto.shipping_address.receiver_name,
            receiverPhone: dto.shipping_address.receiver_phone,
            label: dto.shipping_address.label,
            latitude: dto.shipping_address.latitude,
            longitude: dto.shipping_address.longitude,
            street: dto.shipping_address.street,
            city: dto.shipping_address.city,
            state: dto.shipping_address.state,
            country: dto.shipping_address.country,
            postalCode: dto.shipping_address.postal_code,
            isDefault: dto.shipping_address.is_default,
            createdAt: toIsoString(dto.shipping_address.created_at),
            updatedAt: toIsoString(dto.shipping_address.updated_at),
          }
        : dto.shipping_address,
      user: dto.user
        ? {
            id: dto.user.id,
            email: dto.user.email,
            firstName: dto.user.first_name,
            lastName: dto.user.last_name,
          }
        : dto.user,
    };
  },

  cartToDomain(dto: ICartResponse | null | undefined): IAdminCustomerCart {
    return {
      id: dto?.id ?? "",
      userId: dto?.user_id ?? "",
      createdAt: toIsoString(dto?.created_at),
      updatedAt: toIsoString(dto?.updated_at),
      items:
        dto?.items?.map(
          (item): IAdminCustomerCartItem => ({
            id: item.id,
            cartId: item.cart_id,
            skuId: item.sku_id,
            quantity: item.quantity,
            sku: skuToDomain(item.sku),
          }),
        ) ?? [],
    };
  },

  favoriteToDomain(
    dto: IUserFavoriteProductResponse,
  ): IAdminCustomerFavoriteProduct {
    return {
      userId: dto.user_id,
      productId: dto.product_id,
      createdAt: toIsoString(dto.created_at),
      product: productToDomain(dto.product),
    };
  },
};
