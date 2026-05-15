import { IOrderItemSnapshot } from '@ecommerce/shared';

export interface ISkuSnapshotInput {
  id: string;
  sku_code: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  unit_price: string | null;
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

    return {
      sku: {
        id: sku.id,
        sku_code: sku.sku_code,
        price: sku.price,
        original_price: sku.original_price,
        image_url: sku.image_url,
        unit_price: sku.unit_price,
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

  static deserialize(raw: unknown): IOrderItemSnapshot | null {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      return null;
    }

    const obj = raw as Record<string, unknown>;
    const sku = obj['sku'];

    if (!sku || typeof sku !== 'object' || Array.isArray(sku)) {
      return null;
    }

    const skuObj = sku as Record<string, unknown>;
    const product = skuObj['product'];

    if (!product || typeof product !== 'object' || Array.isArray(product)) {
      return null;
    }

    const productObj = product as Record<string, unknown>;

    // Structural guard: require the minimal fields that the FE depends on
    if (
      typeof skuObj['id'] !== 'string' ||
      typeof skuObj['sku_code'] !== 'string' ||
      typeof productObj['id'] !== 'string' ||
      typeof productObj['name'] !== 'string'
    ) {
      return null;
    }

    return raw as unknown as IOrderItemSnapshot;
  }
}
