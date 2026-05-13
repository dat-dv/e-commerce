import { TBrand } from "@/domain/homepage/types/homepage.model";
import { IBrand } from "@ecommerce/shared";

export class BrandMapper {
  static toDomain(dto: IBrand): TBrand {
    return {
      id: dto.id,
      name: dto.name || "No Name",
      slug: dto.slug,
      logo_url: dto.logo_url || "",
      product_count: dto.product_count,
    };
  }
}
