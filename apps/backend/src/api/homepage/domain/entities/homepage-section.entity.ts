// src/api/homepage/domain/entities/homepage-section.entity.ts

import { IProduct, ISku } from 'src/api/products/domain/entities/product.entity';

export interface IHomepageSection {
  id: string;
  title: string;
  type: string;
  order: number;
  is_enabled: boolean;
  params: Record<string, string> | null;
  created_at: Date;
  updated_at: Date;
}
export interface IHomepageSku extends ISku {
  sale_price?: number;
  sold?: number;
  total?: number;
}

export interface IHomepageProduct extends Omit<IProduct, 'skus'> {
  skus: IHomepageSku[];
}

export interface IHomepageSectionResponse {
  category: {
    id: string;
    title: string;
    type: string;
    slug?: string;
    params?: Record<string, string> | null;
  };
  data: IHomepageProduct[];
}
