import { TBrand } from "@/domain/homepage/types/homepage.model";
import { IBrandResponse } from "@ecommerce/shared";

type IBrandWithRelations = IBrandResponse & {
  name?: string;
  logo_url?: string | null;
  banner_url?: string | null;
  description?: string | null;
  translations?: { name: string; description: string }[];
  logo?: { url: string };
  story_en?: string;
  product_count?: number;
};

export class BrandMapper {
  static toDomain(dto: IBrandResponse): TBrand {
    const brand = dto as IBrandWithRelations;
    const translation = brand.translations?.[0];

    return {
      id: brand.id,
      name: translation?.name || brand.name || "No Name",
      slug: brand.slug,
      logoUrl: brand.logo?.url || brand.logo_url || "",
      bannerUrl: brand.banner_url || "",
      description: translation?.description || brand.description || "",
      story: brand.story_en || "",
      productCount: brand.product_count || 0,
    };
  }
}
