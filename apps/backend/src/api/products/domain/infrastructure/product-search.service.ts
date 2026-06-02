import { EProductSort } from '@ecommerce/shared';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/config/config.validation';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { Prisma } from '../../../../../generated/prisma/client';
import { GetProductsDto } from '../../dto/get-products.dto';

type MeiliSearchHit = {
  id: string;
};

type MeiliSearchResponse = {
  hits: MeiliSearchHit[];
  estimatedTotalHits?: number;
  totalHits?: number;
};

type ProductSearchResult = {
  ids: string[];
  total: number;
};

type ProductSearchDocument = {
  id: string;
  slug: string;
  status: number;
  brand_id: string | null;
  category_ids: string[];
  category_slugs: string[];
  attribute_value_ids: string[];
  sku_codes: string[];
  names: string[];
  descriptions: string[];
  base_price: number;
  min_price: number;
  max_price: number;
  rating: number;
  sold_count: number;
  review_count: number;
  created_at: number;
  updated_at: number;
};

const productSearchInclude = {
  translations: true,
  categories: {
    include: {
      category: {
        include: {
          parent: {
            include: {
              parent: {
                include: {
                  parent: true,
                },
              },
            },
          },
        },
      },
    },
  },
  skus: {
    include: {
      sku_attribute_values: true,
    },
  },
} satisfies Prisma.ProductInclude;

type ProductSearchModel = Prisma.ProductGetPayload<{
  include: typeof productSearchInclude;
}>;
type ProductSearchCategory = ProductSearchModel['categories'][number]['category'];

class MeilisearchRequestError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

@Injectable()
export class ProductSearchService {
  private readonly logger = new Logger(ProductSearchService.name);
  private readonly host: string;
  private readonly apiKey?: string;
  private readonly indexName: string;

  constructor(
    private readonly configService: ConfigService<EnvVars>,
    private readonly prisma: PrismaService,
  ) {
    const host = this.configService.get<string>('MEILISEARCH_HOST') ?? '';

    this.host = host.replace(/\/$/, '');
    this.apiKey = this.configService.get<string>('MEILISEARCH_API_KEY');
    this.indexName = 'products';
  }

  isEnabled(): boolean {
    return this.host.length > 0;
  }

  async searchProducts(params: GetProductsDto): Promise<ProductSearchResult | null> {
    if (!this.isEnabled()) return null;

    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const response = await this.request<MeiliSearchResponse>(`/indexes/${this.indexName}/search`, {
      method: 'POST',
      body: JSON.stringify({
        q: params.search ?? '',
        offset: (page - 1) * limit,
        limit,
        filter: this.buildFilters(params),
        sort: this.buildSort(params.sort),
      }),
    });

    return {
      ids: response.hits.map((hit) => hit.id),
      total: response.estimatedTotalHits ?? response.totalHits ?? response.hits.length,
    };
  }

  async reindexProducts(): Promise<{ indexed: number; index: string }> {
    if (!this.isEnabled()) {
      this.logger.warn('MEILISEARCH_HOST is not configured. Product reindex skipped.');
      return { indexed: 0, index: this.indexName };
    }

    await this.configureIndex();
    await this.request(`/indexes/${this.indexName}/documents`, {
      method: 'DELETE',
    });

    const batchSize = 500;
    let cursor: string | undefined;
    let indexed = 0;

    while (true) {
      const products = await this.prisma.product.findMany({
        where: { deleted_at: null },
        take: batchSize,
        ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
        orderBy: { id: 'asc' },
        include: productSearchInclude,
      });

      if (products.length === 0) break;

      await this.request(`/indexes/${this.indexName}/documents?primaryKey=id`, {
        method: 'POST',
        body: JSON.stringify(products.map((product) => this.toSearchDocument(product))),
      });

      indexed += products.length;
      cursor = products[products.length - 1]?.id;

      if (products.length < batchSize) break;
    }

    return { indexed, index: this.indexName };
  }

  private async ensureIndex(): Promise<void> {
    try {
      await this.request('/indexes', {
        method: 'POST',
        body: JSON.stringify({
          uid: this.indexName,
          primaryKey: 'id',
        }),
      });
    } catch (error) {
      if (error instanceof MeilisearchRequestError && error.status === 409) {
        return;
      }

      throw error;
    }
  }

  private async configureIndex(): Promise<void> {
    await this.ensureIndex();

    await this.request(`/indexes/${this.indexName}/settings`, {
      method: 'PATCH',
      body: JSON.stringify({
        searchableAttributes: ['names', 'descriptions', 'slug', 'sku_codes'],
        filterableAttributes: [
          'status',
          'brand_id',
          'category_ids',
          'category_slugs',
          'attribute_value_ids',
          'base_price',
          'min_price',
          'max_price',
          'rating',
        ],
        sortableAttributes: ['base_price', 'min_price', 'sold_count', 'created_at', 'rating'],
        displayedAttributes: ['id'],
      }),
    });
  }

  private buildFilters(params: GetProductsDto): string[] {
    const filters: string[] = [];

    if (params.category_id) {
      filters.push(`category_ids = ${this.quoteFilterValue(params.category_id)}`);
    }

    if (params.category_slug) {
      filters.push(`category_slugs = ${this.quoteFilterValue(params.category_slug)}`);
    }

    if (params.brand_id) {
      filters.push(`brand_id = ${this.quoteFilterValue(params.brand_id)}`);
    }

    if (params.rating !== undefined) {
      filters.push(`rating >= ${params.rating}`);
    }

    if (params.min_price !== undefined) {
      filters.push(`max_price >= ${params.min_price}`);
    }

    if (params.max_price !== undefined) {
      filters.push(`min_price <= ${params.max_price}`);
    }

    if (params.attribute_value_ids && params.attribute_value_ids.length > 0) {
      const values = params.attribute_value_ids.map((id) => this.quoteFilterValue(id)).join(', ');
      filters.push(`attribute_value_ids IN [${values}]`);
    }

    return filters;
  }

  private buildSort(sort?: number): string[] {
    if (sort === EProductSort.PRICE_ASC) return ['base_price:asc'];
    if (sort === EProductSort.PRICE_DESC) return ['base_price:desc'];
    if (sort === EProductSort.BUY_MOST) return ['sold_count:desc'];
    if (sort === EProductSort.BUY_LESS) return ['sold_count:asc'];

    return ['created_at:desc'];
  }

  private toSearchDocument(product: ProductSearchModel): ProductSearchDocument {
    const prices = product.skus.map((sku) => sku.price);
    const attributeValueIds = product.skus.flatMap((sku) =>
      sku.sku_attribute_values.map((item) => item.attribute_value_id),
    );

    return {
      id: product.id,
      slug: product.slug,
      status: product.status,
      brand_id: product.brand_id,
      category_ids: Array.from(
        new Set<string>(product.categories.flatMap((item) => this.collectCategoryIds(item.category))),
      ),
      category_slugs: Array.from(
        new Set<string>(product.categories.flatMap((item) => this.collectCategorySlugs(item.category))),
      ),
      attribute_value_ids: Array.from(new Set<string>(attributeValueIds)),
      sku_codes: product.skus.map((sku) => sku.sku_code),
      names: product.translations
        .map((translation) => translation.name)
        .filter((value): value is string => Boolean(value)),
      descriptions: product.translations
        .map((translation) => translation.description)
        .filter((value): value is string => Boolean(value)),
      base_price: product.base_price,
      min_price: prices.length > 0 ? Math.min(...prices) : product.base_price,
      max_price: prices.length > 0 ? Math.max(...prices) : product.base_price,
      rating: product.rating,
      sold_count: product.sold_count,
      review_count: product.review_count,
      created_at: new Date(product.created_at).getTime(),
      updated_at: new Date(product.updated_at).getTime(),
    };
  }

  private collectCategoryIds(category: ProductSearchCategory): string[] {
    const ids: string[] = [];
    let current: ProductSearchCategory | null = category;

    while (current) {
      ids.push(current.id);
      current = current.parent;
    }

    return ids;
  }

  private collectCategorySlugs(category: ProductSearchCategory): string[] {
    const slugs: string[] = [];
    let current: ProductSearchCategory | null = category;

    while (current) {
      slugs.push(current.slug);
      current = current.parent;
    }

    return slugs;
  }

  private quoteFilterValue(value: string): string {
    return JSON.stringify(value);
  }

  private async request<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.host}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
        ...init.headers,
      },
    });

    if (!response.ok) {
      const message = await response.text();
      throw new MeilisearchRequestError(response.status, `Meilisearch request failed (${response.status}): ${message}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }
}
