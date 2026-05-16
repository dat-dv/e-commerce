import { TBrand } from "../../homepage/types/homepage.model";
import { IBrandResponse } from "../../homepage/types/homepage.response";

export class BrandMapper {
  static toDomain(dto: IBrandResponse): TBrand {
    return {
      id: dto.id,
      name: dto.name,
      slug: dto.slug,
      logoUrl: dto.logo_url,
      bannerUrl: dto.banner_url,
      story: dto.story,
      description: dto.description,
      productCount: dto.product_count,
    };
  }
}
