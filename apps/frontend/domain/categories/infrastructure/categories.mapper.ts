import { TCategory } from "../types/categories.model";
import { ICategoryResponse } from "@ecommerce/shared";

export class CategoryMapper {
  static toDomain(response: ICategoryResponse): TCategory {
    return {
      id: response.id,
      slug: response.slug,
      name: response.translations?.[0]?.name || response.slug,
      children: response.children?.map((child: ICategoryResponse) =>
        CategoryMapper.toDomain(child),
      ),
    };
  }
}
