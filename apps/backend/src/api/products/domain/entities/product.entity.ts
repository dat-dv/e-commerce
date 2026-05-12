export interface IProduct {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  compare_at_price?: number | null;
  stock: number;
  sold_count: number;
  category_id?: string | null;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}
