import { TBrand } from "@/domain/homepage/types/homepage.model";
import { IBrandResponse } from "@/domain/homepage/types/homepage.response";

export class BrandMapper {
  static toDomain(dto: IBrandResponse): TBrand {
    return {
      id: dto.id,
      name: dto.name,
      slug: dto.slug,
      logo_url: dto.logo_url,
      product_count: dto.product_count,
    };
  }
}
