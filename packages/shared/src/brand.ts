import { IImage } from './image';

export interface IBrandTranslation {
  language_id: string;
  name: string;
  description?: string | null;
  story?: string | null;
}

export interface IBrand {
  id: string;
  slug: string;
  name?: string; // from translation
  logo_url?: string | null;
  banner_url?: string | null;
  website_url?: string | null;
  is_verified: boolean;
  is_featured: boolean;
  order: number;
  description?: string | null;
  description_en?: string | null;
  description_vi?: string | null;
  story_en?: string | null;
  story_vi?: string | null;
  founded_year?: number | null;
  headquarters?: string | null;
  product_count?: number;
  logo?: IImage | null;
  translations?: IBrandTranslation[];
}
