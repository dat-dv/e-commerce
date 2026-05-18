import { IOrderItemSnapshot } from '@ecommerce/shared';

export interface ISkuSnapshotInput {
  id: string;
  sku_code: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  unit_price: string | null;
  sku_attribute_values?: {
    attribute_value: {
      value: string;
      attribute: {
        name: string;
      };
    };
  }[];
  product: {
    id: string;
    slug: string;
    base_price: number;
    rating: number;
    thumbnail: { url: string } | null;
    translations: { language_id: string; name: string }[];
  };
}

export class OrderItemSnapshotTransformer {
  static serialize(sku: ISkuSnapshotInput, preferredLanguage = 'vi'): IOrderItemSnapshot {
    const nameTranslation =
      sku.product.translations.find((t) => t.language_id === preferredLanguage) ?? sku.product.translations[0];

    const attributes = sku.sku_attribute_values
      ?.map((av) => `${av.attribute_value.attribute.name}: ${av.attribute_value.value}`)
      .join(', ');

    return {
      sku: {
        id: sku.id,
        sku_code: sku.sku_code,
        price: sku.price,
        original_price: sku.original_price,
        image_url: sku.image_url,
        unit_price: sku.unit_price,
        attributes: attributes ?? null,
        product: {
          id: sku.product.id,
          slug: sku.product.slug,
          name: nameTranslation?.name ?? '',
          thumbnail_url: sku.product.thumbnail?.url ?? null,
          base_price: sku.product.base_price,
          rating: sku.product.rating,
        },
      },
    };
  }
}
