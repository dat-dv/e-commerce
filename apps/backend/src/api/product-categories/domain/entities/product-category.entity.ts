export interface IProductCategoryTranslation {
  id: string;
  category_id: string;
  language_id: string;
  name: string;
  description?: string | null;
}

export interface IProductCategory {
  id: string;
  slug: string;
  image_id?: string | null;
  parent_id?: string | null;
  level: number;
  order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;

  translations?: IProductCategoryTranslation[];
  children?: IProductCategory[];
}
