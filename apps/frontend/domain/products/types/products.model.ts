export interface IProduct {
  id: string;
  name: string;
  price: string;
  original_price?: string;
  discount_percent?: number;
  category: string;
  image_url?: string;
}
