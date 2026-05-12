import { ICategory } from "../types/categories.model";
import { ICategoryResponse } from "../types/categories.response";

export class CategoryMapper {
  static toDomain(response: ICategoryResponse): ICategory {
    return {
      id: response.id,
      slug: response.slug,
      name: response.translations?.[0]?.name || response.slug,
    };
  }
}
