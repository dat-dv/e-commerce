import { TBrand } from "@/domain/homepage/types/homepage.model";
import { IBrandResponse } from "@ecommerce/shared";

export class BrandMapper {
  static toDomain(brand: IBrandResponse): TBrand {
    const translation = brand.translations?.[0];

    return {
      id: brand.id,
      name: translation?.name || "No Name",
      slug: brand.slug,
      logoUrl: brand.logo?.url || brand.logo_url || "",
      bannerUrl: brand.banner_url || "",
      description: translation?.description || "",
      story: brand.story_en || "",
      productCount: brand.product_count || 0,
    };
  }
}
