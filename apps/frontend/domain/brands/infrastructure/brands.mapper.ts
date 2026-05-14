import { TBrand } from "@/domain/homepage/types/homepage.model";
import { IBrand } from "@ecommerce/shared";

export class BrandMapper {
  static toDomain(dto: IBrand): TBrand {
    return {
      id: dto.id,
      name: dto.name || "No Name",
      slug: dto.slug,
      logo_url: dto.logo_url || dto.logo?.url || "",
      banner_url: dto.banner_url || "",
      description: dto.description || dto.description_en || "",
      story: dto.story_vi || dto.story_en || "",
      product_count: dto.product_count || 0,
    };
  }
}
