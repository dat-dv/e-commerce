import { TCategory } from "../types/categories.model";
import { IProductCategory } from "@ecommerce/shared";

export class CategoryMapper {
  static toDomain(response: IProductCategory): TCategory {
    return {
      id: response.id,
      slug: response.slug,
      name: response.translations?.[0]?.name || response.slug,
      children: response.children?.map((child) =>
        CategoryMapper.toDomain(child),
      ),
    };
  }
}
