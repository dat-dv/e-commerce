import { TBrand } from "@/domain/homepage/types/homepage.model";
import { IBrandResponse } from "@ecommerce/shared";

export class BrandMapper {
  static toDomain(dto: IBrandResponse): TBrand {
    return {
      id: dto.id,
      name: dto.name || "No Name",
      slug: dto.slug,
      logoUrl: dto.logo_url || "",
      bannerUrl: dto.banner_url || "",
      description: dto.description || "",
      story: dto.story_en || "",
      productCount: dto.product_count || 0,
    };
  }
}
